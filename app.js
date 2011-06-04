require.paths.unshift('lib', 'lib/server');

var express = require('express')
  , config = require('./config')  
  , fs = require('fs')
  , bundle = require('bundle')
  , dropbox = require('dropbox')
  , colors = require('colors')
  , crypto = require('crypto')
  , everyauth = require('everyauth')
  ;

var bundlePaths = [
    './public/scripts/vendor'
  , './lib/client'
  ]
  , bundleTarget = './public/scripts/presenter.js';

bundle(bundlePaths, bundleTarget);

var app = module.exports = express.createServer();

app.configure(function () {
  app.use(express.logger({ 
    format: ':method :status'.yellow +
	    ' :url'.white +
	    ' -' +
	    ' :response-time'.green +
	    ' ms'.blue +
	    ' -' +
	    ' :remote-addr :user-agent'.cyan +
	    ' -' +
	    ' :date'.light_gray
  }));
  app.use(express.static(__dirname + '/public'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({
    secret: crypto.createHash('sha256').update(Math.random()+'').digest('hex')
  }));
  app.use(everyauth.middleware());
  app.use(app.router);
  app.set('views', __dirname + '/views')
  app.set('view engine', 'jade');
});

everyauth.helpExpress(app);

app.configure('development', function () {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function () {
  app.use(express.errorHandler());
});

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/list', dropbox.secure, dropbox.files, function (req, res, next) {
  res.render('list', { files: req.data });
});

app.get('/authorized', function (req, res) {
  var url = req.session.redirectPath;
  if (url) {
    return res.redirect(url);
  }
  res.redirect('/');
});

app.get('/edit/presenterjs/:file', dropbox.secure, dropbox.file, function (req, res) {
  var file = req.params.file;
  res.render('edit', { 'presentation': file, 'data': req.data });
});
