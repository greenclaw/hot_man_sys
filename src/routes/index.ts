/// <reference path="../../typings/index.d.ts" />

import {Router} from 'express';

const index = Router();

import passport = require('passport')

import * as model from '../model'

/* GET home page. */
index.get('/', function(req, res, next) {
  res.render('index', {
    guest: req.user
  });
});

/* GET Quick Start. */
index.get('/quickstart', function(req, res, next) {
  res.render('quickstart');
});

index.get('/login', function(req, res, next) {
  res.render('login', {
    guest: req.user
  });
});

index.post(`/login`,
  passport.authenticate(`local`, { 
    successRedirect: `/`,
    failureRedirect: `/login`
  }),
  (req, res, next) => {
    req.session.save((err) => {
      if (err) return next(err)
      res.redirect(`/`)
    })
  })

// Hotfix to clean up logs
interface RequestWithLogoutMethod extends Express.Request {
  logout?: any
}

index.get(`/logout`, (req: RequestWithLogoutMethod, res, next) => {
  req.logout()
  req.session.save((err) => {
    if (err) return next(err);
    res.redirect('/');
  })
})

/*
index.get('/',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res, next) {
    console.log(req.user)
    res.render('index', { guest: req.user });
  });
  */

index.get(`/signup`, (req, res, next) => {
  res.render(`signup`, {
    // guest: req.user
  })
})

index.post('/signup', (req, res, next) => {
  model.guests.create(req.body as model.Guest, (err, guest) => {
    if (err) {
      console.log(err)
      return res.render('signup', { error: err.message })
    }
    passport.authenticate('local')(req, res, () => {
      console.log('REQUEST SESSION' ,req.session)
      req.session.save((err) => {
        if (err) {
          return next(err)
        }
        res.redirect('/')
      })
    })
  })
})

index.get('/ping', (req, res) => {
    res.status(200).send("pong");
});

export default index;
