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

import bcrypt = require('bcryptjs');

// const expressVue =  require('express-vue')

// models and schemas
import * as model from './model'
import * as schemas from './models/schemas/schemas' 

const app: express.Express = express();

// view engine setup
app.set('views', join(__dirname, 'views'));
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
app.use(`/moment`,       express.static(__dirname + '/../node_modules/moment/'))
app.use(`/vue`,          express.static(__dirname + '/../node_modules/vue/dist/'))
app.use(`/vue-material`, express.static(__dirname + '/../node_modules/vue-material/dist/'))


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
  null;
});

passport.use('signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'user_password',
    session: true,
    passReqToCallback : true
  },
  (req: express.Request, email: string, password: string, done) => {
    model.guests.selectOne('email', email, (err, guest: schemas.Guest) => {
      // in case of any error
      if (err) {
        console.log(`Guest signup error: ${err}`)
        return done(err, false, req.flash(`danger`, `Guest signup error: ${err}`)); 
      }
      // guest already exists
      if (guest) {
        console.log(`Guest ${email} already exists`)
        return done(null, false, req.flash(`warning`, `Guest ${email} already exists`))
      }
      
      // salting and hashig password
      req.body.user_password = 
          bcrypt.hashSync(req.body.user_password, bcrypt.genSaltSync())

      // create a new guest
      model.insert(`guests`, 
          [
            `first_name`,
            `last_name`,
            `email`,
            `user_password`
          ], 
          [
            req.body.first_name,
            req.body.last_name,
            req.body.email,
            req.body.user_password
          ], 
          (err, isOk) => {
        // in case of any error
        if (err) {
          console.log(`Guest creation error: `, err)
          return done(err, false, req.flash(`danger`, `Guest creation error: ${err}`))
        }
        // new guest created
        console.log(`New guest created: `, req.body)
        done(null, req.body, req.flash(`success`, 
            `Welcome, ${req.body.first_name} ${req.body.last_name}!`))
      })
    })
  }))

passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'user_password',
    session: true,
    passReqToCallback : true
  },
  (req: express.Request, email: string, password: string, done) => {
    model.selectOne(`guests`,'email', email, (err, user: schemas.Guest) => {
      // in case of any error
      if (err) {
        console.log(`User login error: ${err}`)
        return done(err, false, req.flash(`danger`, `User login error: ${err}`)); 
      }
      // no guest found
      if (!user) {
        console.log(`No user with email ${email}`)
        return done(null, false, req.flash(`warning`, `No user with email ${email}`)); 
      }
      // incorrect password
      if (!bcrypt.compareSync(password, user.user_password)) {
        console.log(`Incorrect password for ${email}`)
        return done(null, false, req.flash(`warning`, `Incorrect password for ${email}`)); 
      }
      // correct password
      console.log(`Successful login for ${email}`)
      done(null, user, req.flash(`success`, `Successful login for ${email}`));
    })
  }))

passport.use('management-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'user_password',
    session: true,
    passReqToCallback : true
  },
  (req: express.Request, email: string, password: string, done) => {
    model.selectOne(`managers`,'email', email, (err, user: schemas.Manager) => {
      // in case of any error
      if (err) {
        console.log(`User login error: ${err}`)
        return done(err, false, req.flash(`danger`, `User login error: ${err}`)); 
      }
      // no guest found
      if (!user) {
        console.log(`No user with email ${email}`)
        return done(null, false, req.flash(`warning`, `No user with email ${email}`)); 
      }
      // incorrect password
      if (!bcrypt.compareSync(password, user.user_password)) {
        console.log(`Incorrect password for ${email}`)
        return done(null, false, req.flash(`warning`, `Incorrect password for ${email}`)); 
      }
      // correct password
      console.log(`Successful login for ${email}`)
      done(null, user, req.flash(`success`, `Successful login for ${email}`));
    })
  }))

passport.use('ownership-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'user_password',
    session: true,
    passReqToCallback : true
  },
  (req: express.Request, email: string, password: string, done) => {
    model.selectOne(`hotel_owners`,'email', email, (err, user: schemas.HotelOwner) => {
      // in case of any error
      if (err) {
        console.log(`User login error: ${err}`)
        return done(err, false, req.flash(`danger`, `User login error: ${err}`)); 
      }
      // no guest found
      if (!user) {
        console.log(`No user with email ${email}`)
        return done(null, false, req.flash(`warning`, `No user with email ${email}`)); 
      }
      // incorrect password
      if (!bcrypt.compareSync(password, user.user_password)) {
        console.log(`Incorrect password for ${email}`)
        return done(null, false, req.flash(`warning`, `Incorrect password for ${email}`)); 
      }
      // correct password
      console.log(`Successful login for ${email}`)
      done(null, user, req.flash(`success`, `Successful login for ${email}`));
    })
  }))

passport.use('administration-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'user_password',
    session: true,
    passReqToCallback : true
  },
  (req: express.Request, email: string, password: string, done) => {
    model.selectOne(`hotel_owners`,'email', email, (err, user: schemas.HotelOwner) => {
      // in case of any error
      if (err) {
        console.log(`User login error: ${err}`)
        return done(err, false, req.flash(`danger`, `User login error: ${err}`)); 
      }
      // no guest found
      if (!user) {
        console.log(`No user with email ${email}`)
        return done(null, false, req.flash(`warning`, `No user with email ${email}`)); 
      }
      // incorrect password
      if (!bcrypt.compareSync(password, user.user_password)) {
        console.log(`Incorrect password for ${email}`)
        return done(null, false, req.flash(`warning`, `Incorrect password for ${email}`)); 
      }
      // correct password
      console.log(`Successful login for ${email}`)
      done(null, user, req.flash(`success`, `Successful login for ${email}`));
    })
  }))

passport.serializeUser((user: schemas.User, done) => {
  console.log(`Serializing user ${user.email}`)
  done(null, user.email);
});

passport.deserializeUser((user, done) => {
  model.selectOne(`users`, 'email', user.email, (err, user: schemas.User) => {
    if (err) {
      console.log(`Serializing error: `, err)
      return done(err);
    }
    console.log(`Deserializing user ${user.email}`)
    done(null, user);
  });
});

export default app;