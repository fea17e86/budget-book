var path = require('path');
var express = require('express');
var config = require('./config.js');
var app = express();

app.use(express.static('./public'));
app.set('port', (process.env.PORT || config.server.port || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));

app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});


/*var COMMENTS_FILE = path.join(__dirname, 'comments.json');

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/api/comments', function(req, res) {
  fs.readFile(COMMENTS_FILE, function(err, data) {
    res.setHeader('Cache-Control', 'no-cache');
    res.json(JSON.parse(data));
  });
});

app.post('/api/comments', function(req, res) {
  fs.readFile(COMMENTS_FILE, function(err, data) {
    var comments = JSON.parse(data);
    comments.push(req.body);
    fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 4), function(err) {
      res.setHeader('Cache-Control', 'no-cache');
      res.json(comments);
    });
  });
});


app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});*/
