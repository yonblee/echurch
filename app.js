require('module-alias/register');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./bin/ychurch.db");

var indexRouter = require('./routes/index');
var loginRouter = require("./routes/auth/login.routes")
var signupRouter = require("./routes/auth/signup.routes")

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, './public')));
app.db = db

//create DB Tables
app.db.serialize(() => {
    db.run(
        "CREATE TABLE IF NOT EXISTS users (UUID VARCHAR(50) NOT NULL, fullname VARCHAR(50) NOT NUll, email VARCHAR(50) NOT NUll UNIQUE, password VARCHAR(20) NOT NULL)"
    );

});


// ROUTES handler
app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/signup', signupRouter);

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
