var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  res.render('index', {project: {name: 'Budget Book', active: 'transactions'}, title: 'Transactions'});
});

router.get('/:id', function (req, res, next) {
  res.render('index', {project: {name: 'Budget Book', active: 'transactions'}, title: 'Transaction - ' + req.params.id});
});

module.exports = router;
