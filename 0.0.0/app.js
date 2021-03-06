var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');

var index = require('./routes/index');
var accounts = require('./routes/accounts');
var reports = require('./routes/reports');
var transactions = require('./routes/transactions');
var users = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var hbs = exphbs.create({
  defaultLayout: 'base',
  extname: '.hbs',
  helpers: {
    and: function (a, b, options) {return a && b;},
    or: function (a, b, options) {return a || b;},
    equals: function (a, b, options) {return a === b;},
    glov: function (name, options) {return selected;}, 
    equalsClass: function (a, b, className) {console.log(className, a, b); return a === b ? className : '';}
  }
});

app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.use('/', index);
app.use('/accounts', accounts);
app.use('/reports', reports);
app.use('/transactions', transactions);
app.use('/users', users);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
