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
            console.log(error.message);
            // Se houver um erro de duplicate key (cpf) envia status de conflict
            if (error.code === 11000) return res.status(409).send('Cpf already registered.');
            res.status(500).send(error.message);
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
            console.log(error.message)
            res.status(500).send(error.message);
        }
    }

    static async deleteAccount(req, res) {
        try {
            const id = req.params.id

            await Account.deleteOne({ _id: id })

            res.status(200).send('Conta cancelada com sucesso!')
        } catch (error) {
            console.log(error.message)
            res.status(500).send(error.message)
        }
    }

    static async editAccount(req, res) {
        try {
            const id = req.params.id;

            let account = await Account.findById(id).lean();

            if (!account) {
                return res.status(404).send('Could not find the account');
            }

            const name = req.body.name
            const cpf = req.body.cpf

            if (!name && !cpf) return res.status(400).send('No parameter specified for edit.')

            account = {
                name: name,
                cpf: cpf
            }

            await Account.updateOne({ _id: id }, account)

            res.status(200).json(account)
        } catch (error) {
            console.log(error.message)
            res.status(500).send(error.message)
        }
    }

    static async deposit(req, res) {
        try {
            const id = req.params.id;
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

            res.status(200).json(account);
        } catch (error) {
            console.log(error.message);
            res.status(500).send(error.message);
        }
    }

    static async withdraw(req, res) {
        try {
            const id = req.params.id;
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

            res.status(200).json(account);
        } catch (error) {
            console.log(error.message);
            res.status(500).send(error.message);
        }
    }

    static async transfer(req, res) {
        try {
            const idPayer = req.params.id
            const idReceiver = req.body.idReceiver
            const transferValue = parseFloat(req.body.value);

            // Verifica os valores recebidos
            if (!idPayer) return res.status(400).send('Payer account id not informed.');
            if (!idReceiver) return res.status(400).send('Receiver account id not informed.');
            if (!transferValue || transferValue <= 0.0) return res.status(400).send('Value not informed or invalid.');

            const payer = await Account.findById(idPayer);
            const receiver = await Account.findById(idReceiver);

            // Verifica se os clientes existem
            if (!payer) return res.status(404).send('Payer account not found.');
            if (!receiver) return res.status(404).send('Receiver account not found.');

            let payerBalance = parseFloat(payer.balance);
            let receiverBalance = parseFloat(receiver.balance);

            if (payerBalance < transferValue) return res.status(400).send('Not enough balance.');

            const transaction = new Transaction({ // Cria a transação de transferencia
                type: 'transfer',
                value: transferValue,
                participants: {
                    payer: payer._id,
                    receiver: receiver._id,
                },
            });

            await transaction.save();

            payer.balance = payerBalance - transferValue;
            receiver.balance = receiverBalance + transferValue;
            payer.transactions.push(transaction);
            receiver.transactions.push(transaction);

            await payer.save();
            await receiver.save();

            res.status(200).json(transaction);
        } catch (error) {
            console.log(error.message)
            res.status(500).send(error.message)
        }
    }

    static async showStatement(req, res) {
        try {
            const id = req.params.id

            // Verifica se os dados foram enviados
            if (!id) return res.status(400).send('No account id informed.');

            // Verifica as transações do cliente
            const transactions = await Transaction.find({
                $or: [
                    { 'participants.payer': id },
                    { 'participants.receiver': id }
                ]
            }).populate({ // popula os campos dos pagadores e recebedores com o nome de cada um
                path: 'participants.payer participants.receiver',
                select: 'name'
            })

            if (!transactions.length) return res.status(404).send('No transactions found.');

            res.status(200).json(transactions)

        } catch (error) {
            console.log(error.message)
            res.status(500).send(error.message)
        }
    }

} // Fim
