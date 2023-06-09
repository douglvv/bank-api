const express = require('express');
const https = require('https');
const fs = require('fs');
const app = express();
const process = require('process');
require('./db/conn')

// Caminho para as variáveis de ambiente para a 
// chave e certificado SLL para o server https
const SSL_KEY = process.env.OPENSSL_KEY;
const SSL_CERTIFICATE = process.env.OPENSSL_CERTIFICATE;

// Routes
const accountRoutes = require('./routes/accountRoutes')

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/account', accountRoutes)

// Rota inicial, para testar a aplicação
app.get('/', function (req, res) {
    res.status(200).send('Ok')
})

// configs servidor https
const options = {
    key: fs.readFileSync(SSL_KEY),
    cert: fs.readFileSync(SSL_CERTIFICATE)
}

const server = https.createServer(options, app); // cria o servidor

const port = 3000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = { app, server };




// Controle de sessão e autenticação
// Middleware para verificar sessão

// Depois cria frontend
// Tela login
// Tela Criar conta
// Component navbar com data e opção de sair e botao de editar
// Component conta com balance nome etc
// Tela Editar conta
// Tela para fazer transações
// Tela para ver extrato

// Ver como funciona para fazer routes e fetch na api com react


