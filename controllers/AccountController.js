const mongoose = require('mongoose');
const Account = require('../models/Account')
const Transaction = require('../models/Transaction')



module.exports = class AccountController {

    static async createAccount(req, res) {
        try {
            const name = req.body.name
            const cpf = req.body.cpf

            if (!name) return res.status(400).send('No name informed.')
            if (!cpf) return res.status(400).send('No Cpf informed.')

            const account = new Account({ name: name, cpf })

            await account.save()

            res.status(201).json(account)

        } catch (error) {
            console.log(error);
            res.status(500).send('An error occurred while creating the account.', error.message);
        }
    }

    static async showAccount(req, res) {
        try {
            const id = req.params.id;
            const account = await Account.findById(id).lean();

            if (!account) {
                return res.status(404).send('Could not find the account');
            }

            res.status(200).json(account);
        } catch (error) {
            console.log(error)
            res.status(500).send('Internal server error', error);
        }
    }

    static async deleteAccount(req, res) {
        try {
            const id = req.params.id

            await Account.deleteOne({ _id: id })

            res.status(200).send('Conta cancelada com sucesso!')
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    }

    static async editAccount(req, res) {
        try {
            const id = req.params.id;
            const name = req.body.name
            const cpf = req.body.cpf

            let account = {
                name: name,
                cpf: cpf
            }

            await Account.updateOne({ _id: id }, account)

            res.status(200).json(account)
        } catch (error) {
            console.log(error)
            res.status(500).send(error.message)
        }
    }

    static async deposit(req, res) {
        try {
            const id = req.body.id;
            const value = req.body.value;

            // Verifica se os dados foram enviados
            if (!id) return res.status(400).send('No account id informed.');
            if (!value) return res.status(400).send('No value informed.');

            const account = await Account.findById({ _id: id }); // Encontra a conta

            if (!account) return res.status(404).send('Could not find the account'); // Verifica se a conta existe

            let accountBalance = parseFloat(account.balance);
            let depositValue = parseFloat(value);

            account.balance = accountBalance += depositValue; // Adiciona o valor ao saldo

            const transaction = new Transaction({ // Cria a transação depósito
                type: 'deposit',
                value: depositValue,
                participants: { receiver: account._id },
            });

            await transaction.save(); // Salva a transação

            account.transactions.push(transaction._id); // Adiciona a transação ao array de transações da conta

            await account.save(); // Salva as alterações na conta

            res.status(200).send(account);
        } catch (error) {
            console.log(error);
            res.status(500).send(error.message);
        }
    }

    static async withdraw(req, res) {
        try {
            const id = req.body.id;
            const value = req.body.value;

            // Verifica se os dados foram enviados
            if (!id) return res.status(400).send('No account id informed.');
            if (!value) return res.status(400).send('No value informed.');

            const account = await Account.findById(id); // Encontra a conta

            if (!account) return res.status(404).send('Could not find the account'); // Verifica se a conta existe

            const accountBalance = parseFloat(account.balance);
            const withdrawValue = parseFloat(value);

            if (withdrawValue > accountBalance) return res.status(403).send('Not enough balance.'); // Verifica se o saldo é suficiente   

            account.balance -= withdrawValue; // Subtrai o valor do saque

            const transaction = new Transaction({ // Cria a transação de saque
                type: 'withdraw',
                value: withdrawValue,
                participants: { receiver: account._id },
            });

            await transaction.save(); // Salva a transação

            account.transactions.push(transaction._id); // Adiciona a transação ao array de transações da conta

            await account.save(); // Salva as alterações na conta

            res.status(200).send(account);
        } catch (error) {
            console.log(error);
            res.status(500).send(error.message);
        }
    }


    static async transfer(req, res) {

    }

    static async showStatement(req, res) {

    }



} // Fim
