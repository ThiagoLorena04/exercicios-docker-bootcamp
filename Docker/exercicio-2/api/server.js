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
      setTimeout(connectWithRetry, 5000);
    } else {
      console.log('Conectado ao PostgreSQL com sucesso!');
      client.release();
    }
  });
};

connectWithRetry();

app.get('/', (req, res) => {
  res.json({
    message: 'API está rodando!',
    endpoints: {
      raiz: '/',
      testeDB: '/teste-db'
    }
  });
});

app.get('/teste-db', async (req, res) => {
  let client;
  try {
    client = await pool.connect();
    console.log("Conectado para teste!");

    await client.query(`
      CREATE TABLE IF NOT EXISTS visitas (
        id SERIAL PRIMARY KEY,
        data_visita TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query('INSERT INTO visitas (data_visita) VALUES (NOW())');

    const resultado = await client.query('SELECT * FROM visitas ORDER BY data_visita DESC');

    res.status(200).json({
      message: 'Conexão e escrita no banco OK!',
      total_visitas: resultado.rowCount,
      visitas: resultado.rows,
    });
  } catch (err) {
    console.error('Erro no endpoint /teste-db', err.stack);
    res.status(500).json({
      message: 'Erro ao conectar ou escrever no banco de dados!',
      error: err.message,
      dbConfigUsada: {
        host: dbConfig.host,
        user: dbConfig.user,
        database: dbConfig.database,
      }
    });
  } finally {
    if (client) {
      client.release();
      console.log("Cliente liberado.");
    }
  }
});

app.listen(port, () => {
  console.log(`API rodando na porta ${port}`);
  console.log('Tentando se conectar ao banco em:', dbConfig.host);
});