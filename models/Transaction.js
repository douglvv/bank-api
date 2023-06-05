const mongoose = require('../db/conn')
const { Schema, Types } = mongoose

const Transaction = mongoose.model(
    'Transaction',
    new Schema({
        type: {
            type: String,
            enum: ['deposit', 'withdraw', 'transfer'],
            required: true,
        },
        value: {
            type: mongoose.Decimal128,
            required: true
        },
        participants: {
            payer: {
                type: Schema.Types.ObjectId,
                ref: 'Account',
                required: true
            },
            receiver: {
                type: Schema.Types.ObjectId,
                ref: 'Account',
                required: true
            }
        }
    }),
)

module.exports = Transaction
