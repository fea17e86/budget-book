var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  res.render('index', {project: {name: 'Budget Book'}, title: 'Reports'});
});

router.get('/:id', function (req, res, next) {
  res.render('index', {project: {name: 'Budget Book'}, title: 'Report - ' + req.params.id});
});

module.exports = router;
