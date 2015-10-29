/*
 * User
 * ====
 *  name  : String
 *  _type : 'user' (Model)
 *  _id   : String (nedb)
 */

var config = require('../config.js'),
    Model = require('../model.js'),
    Accounts = require('./accounts.js');

var Users = new Model('user', config.server.database.users);

Users.accounts = function (user, callback) {
  if (user) {
    Accounts.get({ owner: (user._id ? user._id : user) }, callback);
  }
};

Users.transactions = function (user, callback) {
  Users.accounts(user, function (err, accounts) {
    if (accounts) {
      var errors = [];
      var transactions = [];
      var count = 0;
      var receiveTransactions = function (err, tas) {
        if (tas) {
          if (!Array.isArray(tas)) {
            transactions.push(tas);
          } else if (tas.length > 0) {
            transactions = transactions.concat(tas);
          }
        } else if (err) {
          errors.push(err);
        }
        count--;
        if (count <= 0) {
          callback(errors, transactions);
        }
      };
      if (!Array.isArray(accounts)) {
        count = 1;
        Accounts.transactions(accounts, receiveTransactions);
      } else if ((count = accounts.length) > 0) {
        for (var i=0; i<accounts.length; i++) {
          Accounts.transactions(accounts[i], receiveTransactions);
        }
      }
    } else if (err) {
      callback(err);
    }
  });
};

module.exports = Users;
