/// <reference path="../typings/index.d.ts" />
"use strict";
var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var path_1 = require('path');
var index_1 = require('./routes/index');
var manage_1 = require('./routes/manage');
var admin_1 = require('./routes/admin');
var cookieParser = require('cookie-parser'); // this module doesn't use the ES6 default export yet
var favicon = require('serve-favicon');
var connectFlash = require('connect-flash');
var passport = require('passport');
var passportLocal = require('passport-local');
var LocalStrategy = passportLocal.Strategy;
// const expressVue =  require('express-vue')
// models and schemas
var model = require('./model');
var app = express();
// view engine setup
app.set('views', path_1.join(__dirname, 'views'));
/*
app.set(`vue`, {
  rootPath: __dirname + `/`,
  layoutsDir: 'views/',
  componentsDir: 'views/components',
  defaultLayout: `layout`
})
app.engine(`vue`, expressVue)
*/
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
app.use("/moment", express.static(__dirname + '/../node_modules/moment/'));
app.use("/vue", express.static(__dirname + '/../node_modules/vue/dist/'));
app.use("/vue-material", express.static(__dirname + '/../node_modules/vue-material/dist/'));
app.use('/', index_1.default);
app.use('/manage', manage_1.default);
app.use('/admin', admin_1.default);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err['status'] = 404;
    next(err);
});
// error handlers
app.set('env', 'development');
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
    null;
});
passport.use('signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'user_password',
    session: true,
    passReqToCallback: true
}, function (req, email, password, done) {
    model.guests.selectOne('email', email, function (err, guest) {
        // in case of any error
        if (err) {
            console.log("Guest signup error: " + err);
            return done(err, false, req.flash("danger", "Guest signup error: " + err));
        }
        // guest already exists
        if (guest) {
            console.log("Guest " + email + " already exists");
            return done(null, false, req.flash("warning", "Guest " + email + " already exists"));
        }
        // create a new guest
        model.guests.insert(req.body, function (err, guest) {
            // in case of any error
            if (err) {
                console.log("Guest creation error: " + err);
                return done(err, false, req.flash("danger", "Guest creation error: " + err));
            }
            // new guest created
            console.log("New guest created: ", guest);
            done(null, guest, req.flash("success", "New guest created: " + guest));
        });
    });
}));
passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'user_password',
    session: true,
    passReqToCallback: true
}, function (req, email, password, done) {
    model.guests.selectOne('email', email, function (err, guest) {
        // in case of any error
        if (err) {
            console.log("Guest login error: " + err);
            return done(err, false, req.flash("danger", "Guest login error: " + err));
        }
        // no guest found
        if (!guest) {
            console.log("No guest with email " + email);
            return done(null, false, req.flash("warning", "No guest with email " + email));
        }
        // incorrect password
        if (guest.user_password != password) {
            console.log("Incorrect password for " + email);
            return done(null, false, req.flash("warning", "Incorrect password for " + email));
        }
        // correct password
        console.log("Successful login for " + email);
        done(null, guest, req.flash("success", "Successful login for " + email));
    });
}));
passport.serializeUser(function (user, done) {
    console.log("Serializing guest " + user.email);
    done(null, user.email);
});
passport.deserializeUser(function (user, done) {
    model.guests.selectOne('email', user, function (err, user) {
        if (err) {
            console.log("Serializing error: " + err);
            return done(err);
        }
        console.log("Deserializing guest " + user);
        done(null, user);
    });
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = app;
//# sourceMappingURL=app.js.map