/// <reference path="../../typings/index.d.ts" />

import * as express from 'express';
import {Router} from 'express';

const administration = Router();

const passport = require('passport')

import * as model from '../model'
import * as schemas from '../models/schemas/schemas'
import { renderWithAlerts } from './index'

// GET index page if logged in
// redirect to login page if not
administration.get('/', (req, res, next) => {
	if (req.user) {
		return model.selectAll(`hotels`, (err, hotels: schemas.Hotel[]) => {
    	renderWithAlerts(req, res, `administration`, {
      	admin: req.user,
      	hotels,
    	})
  	})
	}
  res.redirect(`/administration/login`)
});

// GET login page
administration.get('/login', (req, res, next) => {
  renderWithAlerts(req, res, `login`, {
     admin: req.user
  })
});

// Handle login POST
administration.post(`/login`, passport.authenticate(`administration-login`, {
    successRedirect: `/administration`,
    failureRedirect: `/administration/login`,
    failureFlash: true
  }),
  (req, res, next) => {
    req.session.save((err) => {
      if (err) {
        console.log(`Login error: ${err}`)
        return next(err)
      }
      res.redirect(`/administration`)
    })
  })

export default administration;
