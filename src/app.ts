/// <reference path="../typings/index.d.ts" />

import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import {join} from 'path';
import index from './routes/index';
import users from './routes/users';
import cookieParser = require('cookie-parser'); // this module doesn't use the ES6 default export yet

import * as favicon from 'serve-favicon'

const passport = require('passport')
const Strategy = require('passport-local').Strategy

import * as promise from 'bluebird'

const pgpOptions = { promiseLib: promise }
const pgp = require('pg-promise')(pgpOptions);
const db = pgp({
  host: 'localhost',
  port: 5433,
  database: 'hot_man_sys',
  user: 'postgres',
  password: ''
});

const app: express.Express = express();

// view engine setup
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, 'public')));

app.use(`/jquery`,    express.static(__dirname + '/../node_modules/jquery/dist/'))
app.use(`/tether`,    express.static(__dirname + '/../node_modules/tether/dist/'))
app.use(`/bootstrap`, express.static(__dirname + '/../node_modules/bootstrap/dist/'))
app.use(`/vue`,       express.static(__dirname + '/../node_modules/vue/dist/'))


app.use('/', index);
app.use('/users', users);

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

const hotel = {
  countryname: `Australia`
}

const hotelCols = {

}

db.query("SELECT * FROM ${table^}", { table: hotel, cols: hotelCols})
    .then(function (data) {
        // console.log("DATA:", data); // print data;
        index.get('/hotels', function(req, res, next) {
          res.render('index', { 
            hotels: data,
            title: `Hotels`
          })
        })
    })
    .catch(function (error) {
        console.log("ERROR:", error); // print the error;
    })
    .finally(function () {
        pgp.end(); // for immediate app exit, closing the connection pool.
    });

export default app;