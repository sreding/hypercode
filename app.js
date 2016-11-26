const config = require('./config');
const express = require('express');
const path = require('path');
const logger = require('morgan');

const bodyParser = require('body-parser');
const app = express();

//setup mongo db
const mongoose   = require('mongoose');
mongoose.connect(config.mongoUrl + config.mongoDbName);

// Register models
require('./models');

app.use(logger('dev'));
app.use(bodyParser.json());

// static files are served from /public
app.use(express.static(path.join(__dirname, 'public')));

app.set('port', process.env.PORT || 3000);

const server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});