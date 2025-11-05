const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000; 

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: 5432,
};

const pool = new Pool(dbConfig);

const connectWithRetry = () => {
  pool.connect((err, client, release) => {
    if (err) {
      console.error('Erro ao conectar ao banco... Tentando novamente em 5 seg', err.stack);
      setTimeout(connectWithRetry, 5000); // Tenta de novo
    } else {
      console.log('Conectado ao PostgreSQL com sucesso!');
      client.release();
    }
  });
};

connectWithRetry();

app.get('/health', (req, res) => {
  res.status(200).json({ status: "ok", message: "API está rodando perfeitamente!" });
});

app.get('/teste-db', async (req, res) => {
  let client;
  try {
    client = await pool.connect();
    console.log("Conectado para teste!");

    // Cria tabela
    await client.query(`
      CREATE TABLE IF NOT EXISTS visitas (
        id SERIAL PRIMARY KEY,
        data_visita TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    // Insere visita
    await client.query('INSERT INTO visitas (data_visita) VALUES (NOW())');
    // Busca por visitas
    const resultado = await client.query('SELECT * FROM visitas ORDER BY data_visita DESC LIMIT 10');

    res.status(200).json({
      message: 'Conexão e escrita no banco OK!',
      total_visitas_tabela: resultado.rowCount,
      ultimas_10_visitas: resultado.rows,
    });
  } catch (err) {
    console.error('Erro no endpoint /teste-db', err.stack);
    res.status(500).json({ message: 'Erro ao conectar/escrever no banco!', error: err.message });
  } finally {
    if (client) client.release(); // Libera o cliente
  }
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: "Bem-vindo à API do Desafio!",
    endpoints: {
      health: "/health",
      testeDB: "/teste-db"
    }
  });
});

app.listen(port, () => {
  console.log(`API do Desafio rodando na porta ${port}`);
  console.log(`Tentando se conectar ao banco em: ${dbConfig.host}`);
});