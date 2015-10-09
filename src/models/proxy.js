/*
 * Proxy
 * =====
 *  name  : String
 *  _type : 'proxy' (Model)
 *  _id   : String (nedb)
 */

var config = require('../config'),
    Model = require('../model.js'),
    Transactions = require('./transactions.js');

var Proxies = new Model('proxy', config.database.proxies);

Proxies.transactions = function (proxy, callback) {
  if (proxy) {
    var id = proxy._id ? proxy._id : proxy;
    Transactions.get({ $or: [{ sender: id }, { receiver: id }] }, callback);
  }
};

module.exports = Proxies;
