/// <reference path="../typings/index.d.ts" />
"use strict";
var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var path_1 = require('path');
var index_1 = require('./routes/index');
var users_1 = require('./routes/users');
var cookieParser = require('cookie-parser'); // this module doesn't use the ES6 default export yet
var favicon = require('serve-favicon');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var promise = require('bluebird');
var pgpOptions = { promiseLib: promise };
var pgp = require('pg-promise')(pgpOptions);
var db = pgp({
    host: 'localhost',
    port: 5433,
    database: 'hot_man_sys',
    user: 'postgres',
    password: ''
});
var app = express();
// view engine setup
app.set('views', path_1.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path_1.join(__dirname, 'public')));
app.use("/jquery", express.static(__dirname + '/../node_modules/jquery/dist/'));
app.use("/tether", express.static(__dirname + '/../node_modules/tether/dist/'));
app.use("/bootstrap", express.static(__dirname + '/../node_modules/bootstrap/dist/'));
app.use("/vue", express.static(__dirname + '/../node_modules/vue/dist/'));
app.use('/', index_1.default);
app.use('/users', users_1.default);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err['status'] = 404;
    next(err);
});
// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (error, req, res, next) {
        res.status(error['status'] || 500);
        res.render('error', {
            message: error.message,
            error: error
        });
    });
}
// production error handler
// no stacktraces leaked to user
app.use(function (error, req, res, next) {
    res.status(error['status'] || 500);
    res.render('error', {
        message: error.message,
        error: {}
    });
    return null;
});
/*
passport.use(new Strategy(
  function(username, password, cb) {
    db.users.findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
  }));
*/
var hotel = {
    countryname: "Australia"
};
var hotelCols = {};
db.query("SELECT * FROM ${table^}", { table: hotel, cols: hotelCols })
    .then(function (data) {
    // console.log("DATA:", data); // print data;
    index_1.default.get('/hotels', function (req, res, next) {
        res.render('index', {
            hotels: data,
            title: "Hotels"
        });
    });
})
    .catch(function (error) {
    console.log("ERROR:", error); // print the error;
})
    .finally(function () {
    pgp.end(); // for immediate app exit, closing the connection pool.
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = app;
//# sourceMappingURL=app.js.map