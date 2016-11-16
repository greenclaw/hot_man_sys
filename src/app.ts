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

const passport = require('passport')
const passportLocal = require('passport-local')
const LocalStrategy = passportLocal.Strategy

import * as model from './model'

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

app.set('env', 'development')

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

passport.use('signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'guest_password',
    session: true,
    passReqToCallback : true
  },
  (req, email: string, password: string, done) => {
    model.guests.getOne('email', email, (err, guest: model.Guest) => {
      // in case of any error
      if (err) {
        console.log(`Guest signup error: ${err}`)
        return done(err); 
      }
      // guest already exists
      if (guest) {
        console.log(`Guest ${email} already exists`)
        return done(null, false, { message: `Guest ${email} already exists`})
      }
      // create a new guest
      model.guests.create(req.body as model.Guest, (err, guest: model.Guest) => {
        // in case of any error
        if (err) {
          console.log(`Guest creation error: ${err}`)
          return done(err)
        }
        // new guest created
        console.log(`New guest created: ${guest}`)
        return done(null, guest, { message: `New guest created: ${guest}`})
      })
    })
  }))

passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'guest_password',
    session: true,
    passReqToCallback : true
  },
  (req, email: string, password: string, done) => {
    model.guests.getOne('email', email, (err, guest: model.Guest) => {
      // in case of any error
      if (err) {
        console.log(`Guest login error: ${err}`)
        return done(err); 
      }
      // no guest found
      if (!guest) {
        console.log(`No guest with email ${email}`)
        return done(null, false, { message: `No guest with email ${email}` }); 
      }
      // incorrect password
      if (guest.guest_password != password) {
        console.log(`Incorrect password for ${email}`)
        return done(null, false, { message: `Incorrect password for ${email}` }); 
      }
      // correct password
      console.log(`Successful login for ${email}`)
      return done(null, guest, { message: `Successful login for ${email}` });
    })
  }))

passport.serializeUser((guest: model.Guest, done) => {
  return done(null, guest.id);
});

passport.deserializeUser((id, done) => {
  model.guests.getOne('id', id, (err, guest: model.Guest) => {
    if (err) { 
      return done(err);
    }
    return done(null, guest);
  });
});

export default app;