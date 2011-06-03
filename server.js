var express = require('express')
  , fs = require('fs')
  , bundle = require('./lib/bundle');

var bundlePaths = [
    './public/scripts/vendor'
  , './lib/client'
  ]
  , bundleTarget = './public/scripts/presenter.js';

bundle(bundlePaths, bundleTarget);

var app = express.createServer(express.logger());

app.configure(function () {
  app.use(express.static(__dirname + '/public'));
});

app.get('/', function(request, response) {
  fs.readFile(__dirname + '/public/index.html', function(err, data) {
    response.send(data);
  });
});

app.listen(process.env.PORT || 3000);
