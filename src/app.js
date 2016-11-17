/// <reference path="../typings/index.d.ts" />
"use strict";
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const path_1 = require('path');
const index_1 = require('./routes/index');
const manage_1 = require('./routes/manage');
const admin_1 = require('./routes/admin');
const cookieParser = require('cookie-parser'); // this module doesn't use the ES6 default export yet
const favicon = require('serve-favicon');
const connectFlash = require('connect-flash');
const passport = require('passport');
const passportLocal = require('passport-local');
const LocalStrategy = passportLocal.Strategy;
// models and schemas
const model = require('./model');
const app = express();
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
app.use(`/jquery`, express.static(__dirname + '/../node_modules/jquery/dist/'));
app.use(`/tether`, express.static(__dirname + '/../node_modules/tether/dist/'));
app.use(`/bootstrap`, express.static(__dirname + '/../node_modules/bootstrap/dist/'));
app.use(`/moment`, express.static(__dirname + '/../node_modules/moment/'));
app.use(`/vue`, express.static(__dirname + '/../node_modules/vue/dist/'));
app.use('/', index_1.default);
app.use('/manage', manage_1.default);
app.use('/admin', admin_1.default);
// catch 404 and forward to error handler
app.use((req, res, next) => {
    var err = new Error('Not Found');
    err['status'] = 404;
    next(err);
});
// error handlers
app.set('env', 'development');
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((error, req, res, next) => {
        res.status(error['status'] || 500);
        res.render('error', {
            message: error.message,
            error: error
        });
    });
}
// production error handler
// no stacktraces leaked to user
app.use((error, req, res, next) => {
    res.status(error['status'] || 500);
    res.render('error', {
        message: error.message,
        error: {}
    });
    null;
});
passport.use('signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'guest_password',
    session: true,
    passReqToCallback: true
}, (req, email, password, done) => {
    model.guests.selectOne('email', email, (err, guest) => {
        // in case of any error
        if (err) {
            console.log(`Guest signup error: ${err}`);
            return done(err, false, req.flash(`danger`, `Guest signup error: ${err}`));
        }
        // guest already exists
        if (guest) {
            console.log(`Guest ${email} already exists`);
            return done(null, false, req.flash(`warning`, `Guest ${email} already exists`));
        }
        // create a new guest
        model.guests.insert(req.body, (err, guest) => {
            // in case of any error
            if (err) {
                console.log(`Guest creation error: ${err}`);
                return done(err, false, req.flash(`danger`, `Guest creation error: ${err}`));
            }
            // new guest created
            console.log(`New guest created: `, guest);
            done(null, guest, req.flash(`success`, `New guest created: ${guest}`));
        });
    });
}));
passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'guest_password',
    session: true,
    passReqToCallback: true
}, (req, email, password, done) => {
    model.guests.selectOne('email', email, (err, guest) => {
        // in case of any error
        if (err) {
            console.log(`Guest login error: ${err}`);
            return done(err, false, req.flash(`danger`, `Guest login error: ${err}`));
        }
        // no guest found
        if (!guest) {
            console.log(`No guest with email ${email}`);
            return done(null, false, req.flash(`warning`, `No guest with email ${email}`));
        }
        // incorrect password
        if (guest.guest_password != password) {
            console.log(`Incorrect password for ${email}`);
            return done(null, false, req.flash(`warning`, `Incorrect password for ${email}`));
        }
        // correct password
        console.log(`Successful login for ${email}`);
        done(null, guest, req.flash(`success`, `Successful login for ${email}`));
    });
}));
passport.serializeUser((guest, done) => {
    console.log(`Serializing guest ${guest.email}`);
    done(null, guest.email);
});
passport.deserializeUser((email, done) => {
    model.guests.selectOne('email', email, (err, guest) => {
        if (err) {
            console.log(`Serializing error: ${err}`);
            return done(err);
        }
        console.log(`Deserializing guest ${email}`);
        done(null, guest);
    });
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = app;
//# sourceMappingURL=app.js.map