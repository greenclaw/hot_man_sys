/// <reference path="../../typings/index.d.ts" />

import * as express from 'express';
import {Router} from 'express';

const management = Router();

const passport = require('passport')

import * as model from '../model'
import * as schemas from '../models/schemas/schemas'
import { renderWithAlerts } from './index'

// GET index page if logged in
// redirect to login page if not
management.get('/', (req, res, next) => {
	if (req.user) {
		return model.selectOne(`hotels`, `hotel_id`, 
				(req.user as schemas.Manager).hotel_id, (err, hotels: schemas.Hotel[]) => {
    	renderWithAlerts(req, res, `management`, {
      	manager: req.user,
      	hotels
    	})
  	})
	}
  res.redirect(`/management/login`)
});

// GET login page
management.get('/login', (req, res, next) => {
  renderWithAlerts(req, res, `login`, {
     manager: req.user
  })
});

// Handle login POST
management.post(`/login`, passport.authenticate(`management-login`, {
    successRedirect: `/management`,
    failureRedirect: `/management/login`,
    failureFlash: true
  }),
  (req, res, next) => {
    req.session.save((err) => {
      if (err) {
        console.log(`Login error: ${err}`)
        return next(err)
      }
      res.redirect(`/management`)
    })
  })

export default management;
