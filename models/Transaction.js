const mongoose = require('../db/conn');
const { Schema } = mongoose;

const TransactionSchema = new Schema({
  type: {
    type: String,
    enum: ['deposit', 'withdraw', 'transfer'],
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  participants: {
    payer: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: false,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: false,
    },
  },
});

const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;
