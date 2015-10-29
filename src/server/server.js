var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var config = require('./config.js');
var app = express();

app.use(express.static('./public'));
app.set('port', (process.env.PORT || config.server.port || 3000));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/', express.static(path.join(__dirname, 'public')));

app.use('/api/xyz', function (req, res) {
  res.send({message: 'test'});
});

require('./api.js')(app);

app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
