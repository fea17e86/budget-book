var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  res.render('index', {project: {name: 'Budget Book'}, title: 'Users'});
});

router.get('/:id', function (req, res, next) {
  res.render('index', {project: {name: 'Budget Book'}, title: 'User - ' + req.params.id});
});

module.exports = router;
