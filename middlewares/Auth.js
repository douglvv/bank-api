require('dotenv').config();
const secret = process.env.JWT_TOKEN;
const jwt = require('jsonwebtoken');
const Account = require('../models/Account');

/**
 * Verifica se o usuário tem um token válido
 * @returns status 401 caso a autenticação falhe
 * @callback next caso tenha sucesso na autenticação
 */
function checkAuth(req, res, next) {
    try {
        const token = req.headers.authorization;
        if (!token) return res.status(401).json({ error: 'Unauthorized: No token provided.' });

        jwt.verify(token, secret, (err, decoded) => {
            if (err) return res.status(401).json({ error: 'Unauthorized: Invalid token.' });
            else { // Pega a conta armazenada no payload do token e armazena em req.account
                req.account = decoded.account;
                // console.log(req.account);
                next();
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = checkAuth;

