'use strict';

var path = require('path');
var express = require('express');
var serveStatic = require('serve-static');

var app = express();
var port = process.env.PORT || 8000;

app.use(serveStatic(path.join(__dirname, 'build')));

app.listen(port, function(){
  console.log('Express server listening on port ' + port);
});
