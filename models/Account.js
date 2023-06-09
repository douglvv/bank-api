const mongoose = require('mongoose');
const { Schema } = mongoose;

const accountSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  cpf: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true
  },
  balance: {
    type: String,
    required: true,
    default: '0.00',
  },
  transactions: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Transaction' }],
    required: false,
  },
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
