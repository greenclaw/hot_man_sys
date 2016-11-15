/// <reference path="../../typings/index.d.ts" />

import {Router} from 'express';

const index = Router();

import passport = require('passport')

import * as db from '../db'

/* GET home page. */
index.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Hotel Management System',
    guest: req.user
  });
});

/* GET Quick Start. */
index.get('/quickstart', function(req, res, next) {
  res.render('quickstart');
});

index.get('/login', function(req, res, next) {
  res.render('login', { 
    title: 'Hotel Management System',
    guest: req.user,
    error: req.flash('error')
  });
});

index.post(`/login`,
  passport.authenticate(`local`, { 
    successRedirect: `/`,
    failureRedirect: `/login`
  }),
  (req, res, next) => {
    req.session.save((err) => {
      if (err) {
        return next(err)
      } else {
        res.redirect(`/`)
      }
    })
  })

// Hotfix to clean up logs
interface RequestWithLogoutMethod extends Express.Request {
  logout?: any
}

index.get(`/logout`, (req: RequestWithLogoutMethod, res, next) => {
  req.logout()
  req.session.save((err) => {
    if (err) {
      return next(err);
    } else {
        res.redirect('/');
    }
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
  res.render(`signup`, {})
})

index.post(`/signup`, (req, res, next) => {
  db.guests.signup(req.body as db.Guest, (err, guest) => {

    console.log(req.body)

    if (err) {
      return res.render('signup', { error: err.message })
    } else {
      passport.authenticate('local')(req, res, () => {
        req.session.save((err) => {
          if (err) {
            return next(err)
          } else {
            res.redirect('/')
          }
        })
      })
    }
  })
})

index.get('/ping', (req, res) => {
    res.status(200).send("pong");
});

export default index;
