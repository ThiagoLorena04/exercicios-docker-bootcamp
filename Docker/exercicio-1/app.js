const http = require('http');
const localPort = 3000

const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello from Docker!');
});

server.listen(3000, () => {
    console.log(`Servidor rodando na porta ${localPort}`);
})