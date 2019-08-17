var bodyParser = require('body-parser');
var express = require('express');
var passport = require('passport');
var path = require('path');

var auth = require('./routes/auth');
var index = require('./routes/index');
var news = require('./routes/news');

var app = express();

var config = require('./config/config.json');
require('./models/main.js').connect(config.mongoDbUri);

// view engine setup
app.set('views', path.join(__dirname, '../client/build'));
app.set('view engine', 'jade');
app.use('/static', express.static(path.join(__dirname, '../client/build/static/')));

// TODO: remove this after development is done
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
}); 

app.use(bodyParser.json());

// load passport strategies.
app.use(passport.initialize());
passport.use('local-signup', require('./auth/signup_passport'));
passport.use('local-login', require('./auth/login_passport'));

app.use('/', index);
app.use('/auth', auth);
app.use('/news', require('./auth/auth_checker'));
app.use('/news', news);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404);
});

module.exports = app;
