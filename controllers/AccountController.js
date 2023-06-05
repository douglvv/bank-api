// withdrawal money
// // transactions: {
//     - make deposit
//     - make withdraw
//     - make transfer 
// }
// show statement

const Account = require('../models/Account')
const mongoose = require('mongoose')


module.exports = class AccountController {

    static async createAccount(req, res) {
        try {
            const name = req.body.name
            const cpf = req.body.cpf

            if (!name) return res.status(404).send('No name informed.')
            if (!cpf) return res.status(404).send('No Cpf informed.')

            const account = new Account({ name, cpf })

            await account.save()

            res.status(201).json(account)

        } catch (error) {
            res.status(400).send('Could not create the account', error)
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
          res.status(500).send('Internal server error');
        }
      }
      

    static async deleteAccount(req, res) {
        try {
            const id = req.params.id

            await Account.deleteOne({ _id: id })

            res.status(200).send('Conta cancelada com sucesso!')
        } catch (error) {
            res.status(400).send('Could not delete the account.', error)
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
            res.status(400).send('Could not edit the account.',error)
        }
    }

}
