/*
 * Transaction
 * ===========
 *  date     : Date
 *  amount   : Number
 *  type     : String (Transactions.type)
 *  sender   : String (Account._id)
 *  receiver : String (Account._id || Proxy._id)
 *  status   : String (Transactions.status)
 *  notes    : String
 *  tags     : String[]
 *  _type    : 'transaction' (Model)
 *  _id      : String (nedb)
 */

var config = require('../config'),
    Model = require('../model.js');

var Transactions = new Model('transaction', config.database.transactions);

Transactions.type = {
  deposit: 'deposit',
  transfer: 'transfer',
  withdrawal: 'withdrawal'
};
Transactions.type.list = [Transactions.type.deposit, Transactions.type.transfer, Transactions.type.withdrawal];

module.exports = Transactions;
