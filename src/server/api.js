var path = require('path');
var express = require('express');

module.exports = function (app) {

  var Models = [
    {name: 'accounts', connection: require('./models/accounts.js')},
    {name: 'proxies', connection: require('./models/proxies.js')},
    {name: 'reports'},
    {name: 'transactions', connection: require('./models/transactions.js')},
    {name: 'users', connection: require('./models/users.js')}
  ];

  var stateComplete = function (state) {
    if (state !== undefined && state !== null) {
      for (var i=0; i<Models.length; i++) {
        if (!Array.isArray(state[Models[i].name])) {
          return false;
        }
      }
      return true;
    }
    return false;
  };

  app.use('/api/state', function (req, res) {
    var state = {errors: []};

    var createCallback = function (modelName) {
      return function (err, entities) {
        if (err) {
          state.errors.push(err);
          state[modelName] = [];
        } else {
          state[modelName] = entities;
        }
        if (stateComplete(state)) {
          res.send(state);
        }
      };
    };

    for (var i=0; i<Models.length; i++) {
      if (Models[i].connection) {
        Models[i].connection.list(createCallback(Models[i].name));
      } else {
        state[Models[i].name] = [];
      }
    }
  });

  require('./api/users.js')(app);
};
