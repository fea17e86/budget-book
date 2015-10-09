/*
 * Account
 * =======
 *  name    : String
 *  type    : String (Accounts.type)
 *  balance : Number
 *  owner   : String (User._id)
 *  _type   : 'account' (Model)
 *  _id     : String (nedb)
 */

var config = require('../config'),
    Model = require('../model.js'),
    Transactions = require('./transactions.js');

var Accounts = new Model('account', config.database.accounts);

Accounts.type = {
  bank: 'bank',
  cash: 'cash',
  creditcard: 'creditcard'
};
Accounts.type.list = [Accounts.type.bank, Accounts.type.cash, Accounts.type.creditcard];

Accounts.transactions = function (account, callback) {
  if (account) {
    var id = account._id ? account._id : proxy;
    Transactions.get({ $or: [{ sender: id }, { receiver: id }] }, callback);
  }
};

module.exports = Accounts;
