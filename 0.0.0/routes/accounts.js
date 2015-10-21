var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  res.render('index', {project: {name: 'Budget Book', active: 'accounts'}, title: 'Accounts'});
});

router.get('/:id', function (req, res, next) {
  res.render('index', {project: {name: 'Budget Book', active: 'accounts'}, title: 'Account - ' + req.params.id});
});

module.exports = router;
