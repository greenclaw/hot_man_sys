/// <reference path="../../typings/index.d.ts" />

import * as express from 'express';
import {Router} from 'express';

const ownership = Router();

const passport = require('passport')

import * as model from '../model'
import * as schemas from '../models/schemas/schemas'
import { renderWithAlerts } from './index'

// GET index page if logged in
// redirect to login page if not
ownership.get('/', (req, res, next) => {
	if (req.user) {
		return model.selectMany(`hotels`, `hotel_id`, 
		(req.user as schemas.HotelOwner).hotel_id, (err, hotels: schemas.Hotel[]) => {
    	renderWithAlerts(req, res, `ownership`, {
      	owner: req.user,
      	hotels,
    	})
  	})
	}
  res.redirect(`/ownership/login`)
});

// GET login page
ownership.get('/login', (req, res, next) => {
  renderWithAlerts(req, res, `login`, {
     owner: req.user
  })
});

// Handle login POST
ownership.post(`/login`, passport.authenticate(`ownership-login`, {
    successRedirect: `/ownership`,
    failureRedirect: `/ownership/login`,
    failureFlash: true
  }),
  (req, res, next) => {
    req.session.save((err) => {
      if (err) {
        console.log(`Login error: ${err}`)
        return next(err)
      }
      res.redirect(`/ownership`)
    })
  })

export default ownership;
