var path = require('path');
var express = require('express');

module.exports = function (app) {

  app.use('/api/add', function (req, res) {
    console.log('add', JSON.stringify(req.body));
    res.send();
  });

  app.use('/', express.static(path.join(__dirname, 'public')));
};
