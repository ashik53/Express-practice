
/*
  This is our application file
*/

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('express-handlebars');
var bodyParser = require('body-parser');
/* default route */
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

/* set up session & validation packages  */
var expressValidator = require('express-validator');
var expressSession = require('express-session');

var app = express();

// view engine setup, directory & template type (here it is 'Jade' engine, will be replaced)
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts'} )); //hbs configurations
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs'); //set view engine as hbs, previously it was jade 

/* 
  Middlewares
*/

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(expressValidator());/* this must be included here after bodyParser, this will set up & start express validator */
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); // public folder
/* 
  first param means if you modify the session then it will be saved
  second param means session will be saved after each request
  these two are the default behaviour 

*/
app.use(expressSession({secret:'max', saveUninitialized: false, resave: false}))

/* If you enter '/' then indexRouter will take care of this */
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
