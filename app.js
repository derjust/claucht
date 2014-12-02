var serveStatic = require('serve-static');
var express = require('express');
var engine = require('engine.io');
var http = require('http');
var morgan = require('morgan')
var bodyParser = require('body-parser')
var _ = require('underscore');
var app = express();

app.use(morgan('combined'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// parse application/json
app.use(bodyParser.json());

app.use(express.static(__dirname + '/static'));

var api = require('./lib/api').api(app);


var sockets = [];

http = http.createServer(app).listen(8080);

var server = engine.attach(http);

server.on('connection', function (socket) {
  console.log(">>>> got connection");
  var position = sockets.length;
  sockets.push(socket);
  socket.on('close', function(){
    sockets.splice(position, 1);
 });
});


