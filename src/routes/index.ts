/// <reference path="../../typings/index.d.ts" />

import * as express from 'express';
import {Router} from 'express';

const index = Router();

const passport = require('passport')

import * as model from '../model'
import * as schemas from '../models/schemas/schemas'

const renderWithAlerts = (req: express.Request, res: express.Response, 
    view: string, options: Object) => {
  res.render(view, (Object as any).assign(
    {
      danger: req.flash(`danger`),
      warning: req.flash(`warning`),
      info: req.flash(`info`),
      success: req.flash(`success`)
    },
    options
  ))
}

// GET home page
index.get('/', (req, res, next) => {
  model.hotels.selectAll((err, hotels: schemas.Hotel[]) => {
    renderWithAlerts(req, res, `index`, {
      guest: req.user,
      hotels,
    })
  })
});

// GET login page
index.get('/login', (req, res, next) => {
  renderWithAlerts(req, res, `login`, {
     guest: req.user
  })
});

// Handle login POST
index.post(`/login`, passport.authenticate(`login`, {
    successRedirect: `/`,
    failureRedirect: `/login`,
    failureFlash: true
  }),
  (req, res, next) => {
    req.session.save((err) => {
      if (err) {
        console.log(`Login error: ${err}`)
        return next(err)
      }
      res.redirect(`/`)
    })
  })

// GET signup page
index.get('/signup', (req, res, next) => {
  renderWithAlerts(req, res, `signup`, {
    guest: req.user
  })
});

// Handle signup POST
index.post(`/signup`, passport.authenticate(`signup`, {
    successRedirect: `/`,
    failureRedirect: `/signup`,
    failureFlash: true
  }),
  (req, res, next) => {
    req.session.save((err) => {
      if (err) {
        console.log(`Signup error: ${err}`)
        return next(err)
      }
      res.redirect(`/`)
    })
  })

// Hotfix to clean up logs
interface RequestWithLogoutMethod extends Express.Request {
  logout?: any
}

// Hadle logging out
index.get(`/logout`, (req: RequestWithLogoutMethod, res, next) => {
  req.logout()
  req.session.destroy((err) => {
    if (err) {
      console.log(`Logout error: ${err}`)
      return next(err)
    }
    res.redirect('/');
  })
})

// GET profile page
index.get('/profile', (req, res, next) => {
  renderWithAlerts(req, res, `profile`, {
    guest: req.user
  })
});

// GET reservations page
index.get('/reservations', (req, res, next) => {
  renderWithAlerts(req, res, `reservations`, {
    guest: req.user
  })
});

index.get('/ping', (req, res) => {
    res.status(200).send("pong");
});

export default index;
