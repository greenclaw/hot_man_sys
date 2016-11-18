/// <reference path="../../typings/index.d.ts" />
"use strict";
var express_1 = require('express');
var ownership = express_1.Router();
var passport = require('passport');
var model = require('../model');
var index_1 = require('./index');
// GET index page if logged in
// redirect to login page if not
ownership.get('/', function (req, res, next) {
    if (req.user) {
        return model.selectMany("hotels", "hotel_id", req.user.hotel_id, function (err, hotels) {
            index_1.renderWithAlerts(req, res, "ownership", {
                owner: req.user,
                hotels: hotels,
            });
        });
    }
    res.redirect("/ownership/login");
});
// GET login page
ownership.get('/login', function (req, res, next) {
    index_1.renderWithAlerts(req, res, "login", {
        owner: req.user
    });
});
// Handle login POST
ownership.post("/login", passport.authenticate("ownership-login", {
    successRedirect: "/ownership",
    failureRedirect: "/ownership/login",
    failureFlash: true
}), function (req, res, next) {
    req.session.save(function (err) {
        if (err) {
            console.log("Login error: " + err);
            return next(err);
        }
        res.redirect("/ownership");
    });
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ownership;
//# sourceMappingURL=ownership.js.map