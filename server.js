var express = require('express')
  , fs = require('fs');

var app = express.createServer(express.logger());

app.configure(function () {
  app.use(express.static(__dirname + '/public'));
});

app.get('/', function(request, response) {
  fs.readFile(__dirname + '/public/index.html', function(err, data) {
    response.send(data);
  });
});

var port = process.env.PORT || 3000;
console.log("Listening on " + port);

app.listen(port);
