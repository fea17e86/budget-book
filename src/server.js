var http = require('http'),
    config = require('./config'),
    React = require('react'),
    ReactDOMServer = require('react-dom/server'),
    JSX = require('node-jsx').install(),
    HelloWorld = require('./components/HelloWorld.react');

http.createServer(function(req, res) {
  if (req.url == '/') {
    res.setHeader('Content-Type', 'text/html');

    var html = ReactDOMServer.renderToStaticMarkup(React.createElement(HelloWorld, { name: 'Cynthia Belch' }));

    res.end(html);
  } else {
    res.statusCode = 404;
    res.end();
  }
}).listen(3000, function(err) {
  if (err) throw err
  console.log('Listening on 3000...')
});
