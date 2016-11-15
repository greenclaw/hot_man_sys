/// <reference path="../typings/index.d.ts" />
"use strict";
var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var path_1 = require('path');
var index_1 = require('./routes/index');
var management_1 = require('./routes/management');
var administration_1 = require('./routes/administration');
var cookieParser = require('cookie-parser'); // this module doesn't use the ES6 default export yet
var favicon = require('serve-favicon');
var connectFlash = require('connect-flash');
var passport = require('passport');
var passportLocal = require('passport-local');
var Strategy = passportLocal.Strategy;
var db = require('./db');
var app = express();
// view engine setup
app.set('views', path_1.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser('lorem ipsum'));
app.use(express.static(path_1.join(__dirname, 'public')));
app.use(require('express-session')({
    secret: 'lorem ipsum',
    resave: true,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(connectFlash());
app.use(passport.session());
app.use("/jquery", express.static(__dirname + '/../node_modules/jquery/dist/'));
app.use("/tether", express.static(__dirname + '/../node_modules/tether/dist/'));
app.use("/bootstrap", express.static(__dirname + '/../node_modules/bootstrap/dist/'));
app.use("/vue", express.static(__dirname + '/../node_modules/vue/dist/'));
app.use('/', index_1.default);
app.use('/management', management_1.default);
app.use('/administration', administration_1.default);
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
passport.use(new Strategy({
    usernameField: 'email',
    passwordField: 'password',
    session: true,
    passReqToCallback: true
}, function (req, email, password, callback) {
    db.guests.findByEmail(email, function (err, guest) {
        if (err) {
            return callback(err);
        }
        else if (!guest) {
            console.log("Incorrect username");
            return callback(null, false, { message: 'Incorrect username' });
        }
        else if (guest.password != password) {
            console.log("Incorrect password");
            return callback(null, false, { message: 'Incorrect password' });
        }
        else {
            console.log("Correct username & password");
            return callback(null, guest, { message: "Correct username & password" });
        }
    });
}));
passport.serializeUser(function (guest, callback) {
    callback(null, guest.id);
});
passport.deserializeUser(function (id, callback) {
    db.guests.findById(id, function (err, guest) {
        if (err) {
            return callback(err);
        }
        callback(null, guest);
    });
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = app;
//# sourceMappingURL=app.js.map