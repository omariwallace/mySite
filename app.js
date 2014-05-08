
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var swig = require('swig');

var app = express();

// Swig setup
app.engine('html', swig.renderFile);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
app.set('view cache', false); // disable express caching -- ENABLE FOR PRODUCTION!
swig.setDefaults({cache: false}); // disable swig caching

// Child process for localtunnel
var spawn = require('child_process').spawn;
var lt = spawn("lt", ["--port", "3000", "--subdomain", "owsite"]);
lt.stdout.on("data", function(data) {
  console.log("stdout: ", data);
});

lt.stderr.on("data", function(data) {
  console.log("stdout: ", data);
});

lt.on("close", function(code) {
  console.log("process exited with code: ", code);
});

// Routes
app.get('/', routes.index);
app.get('/users', user.list);

// Server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
