var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require('hbs');
const mongoose = require('mongoose');

// Connect to the Mongo DB
mongoose.Promise = Promise;
if(process.env.NODE_ENV !== "production"){
  mongoose.connect("mongodb://localhost/news");
}
else {
  mongoose.connect("mongodb://heroku_bzjt7nmc:98u5a9706epmg3kn8mf34urirc@ds231758.mlab.com:31758/heroku_bzjt7nmc");
}




// There's a warning that this is deprecated.
// mongoose.connect("mongodb://localhost/news", {
//   useMongoClient: true
// });

var index = require('./routes/index');
var users = require('./routes/users');
var scraper = require('./routes/scraper');
var articles = require('./routes/articles');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Register Partials
hbs.registerPartials(__dirname + '/views/partials');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/scraper', scraper);
app.use('/articles', articles);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
