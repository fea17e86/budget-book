var path = require('path');
var express = require('express');
var Users = require('../models/users.js');

module.exports = function (app) {

  app.post('/api/user', function (req, res) {
    var id = req.body.id;
    var name = req.body.name;
    if (id) {
      Users.update({id: id, name: name}, function (err, numUpdated) {
        var message = numUpdated > 0 ? 'User was successfully updated.' : 'User could not be updated.';
        if (err) {
          res.send({error: err, message: message});
        } else {
          res.send({message: message});
        }
      });
    } else {
      Users.add({name: name}, function (err, user) {
        var message = (user && user.id) ? 'User was successfully added.' : 'User could not be added.';
        if (err) {
          res.send({error: err, message: message});
        } else {
          res.send({user: user, message: message});
        }
      });
    }
  });

  app.post('/api/user/remove', function (req, res) {
    var id = req.body.id;
    if (id) {
      Users.update({id: id}, function (err, numRemoved) {
        var message = numRemoved > 0 ? 'User was successfully removed.' : 'User could not be removed.';
        if (err) {
          res.send({error: err, message: message});
        } else {
          res.send({user: user, message: message});
        }
      });
    } else {
      res.send({message: 'Please send an ID to remove a user.'});
    }
  });
};
