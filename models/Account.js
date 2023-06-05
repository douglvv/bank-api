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
  balance: {
    type: mongoose.Decimal128,
    required: true,
    default: 0,
  },
  transactions: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Transaction' }],
    required: false,
  },
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
