const express = require('express');
const https = require('https');
const fs = require('fs');
const app = express();
// const process = require('process');
const cors = require('cors'); // Libera requisições externas para a api
require('./db/conn')

/**
 * Caminho para as variáveis de ambiente para a 
 * chave e certificado SLL para o server https
 *  */ 
// const SSL_KEY = process.env.OPENSSL_KEY;
// const SSL_CERTIFICATE = process.env.OPENSSL_CERTIFICATE;

// Routes
const accountRoutes = require('./routes/accountRoutes')

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/account', accountRoutes)

// Rota inicial, para testar a aplicação
app.get('/', function (req, res) {
    res.status(200).send('Ok')
})

// configs servidor https
const options = {
    key: fs.readFileSync(__dirname + '\\ssl\\private.key'),
    cert: fs.readFileSync(__dirname + '\\ssl\\certificate.crt')
}

const server = https.createServer(options, app); // cria o servidor

const port = 3001;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = { app, server };

