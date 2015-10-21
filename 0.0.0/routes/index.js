var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  res.render('index', {project: {name: 'Budget Book'}, title: 'Home'});
});

module.exports = router;
