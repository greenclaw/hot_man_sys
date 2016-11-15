/// <reference path="../typings/index.d.ts" />

import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import {join} from 'path';

import index from './routes/index';
import management from './routes/management';
import administration from './routes/administration';

import cookieParser = require('cookie-parser'); // this module doesn't use the ES6 default export yet

import * as favicon from 'serve-favicon'

import connectFlash = require('connect-flash')

import passport = require('passport')
const passportLocal = require('passport-local')
const Strategy = passportLocal.Strategy

import * as db from './db'

const app: express.Express = express();

// view engine setup
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser('lorem ipsum'));
app.use(express.static(join(__dirname, 'public')));

app.use(require('express-session')({ 
  secret: 'lorem ipsum', 
  resave: true, 
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(connectFlash())
app.use(passport.session());

app.use(`/jquery`,    express.static(__dirname + '/../node_modules/jquery/dist/'))
app.use(`/tether`,    express.static(__dirname + '/../node_modules/tether/dist/'))
app.use(`/bootstrap`, express.static(__dirname + '/../node_modules/bootstrap/dist/'))
app.use(`/vue`,       express.static(__dirname + '/../node_modules/vue/dist/'))


app.use('/', index);
app.use('/management', management)
app.use('/administration', administration);



// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err['status'] = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {

  app.use((error: any, req, res, next) => {
    res.status(error['status'] || 500);
    res.render('error', {
      message: error.message,
      error
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((error: any, req, res, next) => {
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
    passReqToCallback : true
  },
  (req, email: string, password: string, callback) => {
    db.guests.findByEmail(email, (err, guest: db.Guest) => {
      if (err) { 
        return callback(err); 
      } else if (!guest) {
        console.log(`Incorrect username`)
        return callback(null, false, { message: 'Incorrect username' }); 
      } else if (guest.password != password) {
        console.log(`Incorrect password`)
        return callback(null, false, { message: 'Incorrect password' }); 
      } else {
        console.log(`Correct username & password`)
        return callback(null, guest, { message: `Correct username & password` });
      }
    });
  }));

passport.serializeUser(function(guest: db.Guest, callback) {
  callback(null, guest.id);
});

passport.deserializeUser(function(id, callback) {
  db.guests.findById(id, function (err, guest: db.Guest) {
    if (err) { return callback(err); }
    callback(null, guest);
  });
});

export default app;