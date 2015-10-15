var express = require('express');
var router = express.Router();
var users = require('../models/users');

router.get('/', function (req, res, next) {
  res.render('users', {project: {name: 'Budget Book'}, title: 'Users', users: users.list()});
});

router.get('/:id', function (req, res, next) {
  res.render('index', {project: {name: 'Budget Book'}, title: 'User - ' + req.params.id});
});

module.exports = router;
