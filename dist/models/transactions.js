/*
 * Transaction
 * ===========
 *  date        : Date
 *  amount      : Number
 *  type        : String (Transactions.type)
 *  account     : String (Account._id)
 *  counterpart {
 *    _id       : String (Account._id || Proxy._id)
 *    type      : 'Accounts.modelType' || Proxy.modelType
 *  }
 *  status      : String (Transactions.status)
 *  notes       : String
 *  tags        : String[]
 *  _type       : 'transaction' (Model)
 *  _id         : String (nedb)
 */

var config = require('../config.js'),
    Model = require('../model.js');

var Transactions = new Model('transaction', config.server.database.transactions);

Transactions.type = {
  deposit: 'deposit',
  transfer: 'transfer',
  withdrawal: 'withdrawal'
};
Transactions.type.list = [Transactions.type.deposit, Transactions.type.transfer, Transactions.type.withdrawal];

module.exports = Transactions;
