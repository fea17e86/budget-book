var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  res.render('index', {project: {name: 'Budget Book', active: 'reports'}, title: 'Reports'});
});

router.get('/:id', function (req, res, next) {
  res.render('index', {project: {name: 'Budget Book', active: 'reports'}, title: 'Report - ' + req.params.id});
});

module.exports = router;
