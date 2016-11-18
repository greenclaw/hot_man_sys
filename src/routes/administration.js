/// <reference path="../../typings/index.d.ts" />
"use strict";
var express_1 = require('express');
var administration = express_1.Router();
var passport = require('passport');
var model = require('../model');
var index_1 = require('./index');
// GET index page if logged in
// redirect to login page if not
administration.get('/', function (req, res, next) {
    if (req.user) {
        return model.selectAll("hotels", function (err, hotels) {
            index_1.renderWithAlerts(req, res, "administration", {
                admin: req.user,
                hotels: hotels,
            });
        });
    }
    res.redirect("/administration/login");
});
// GET login page
administration.get('/login', function (req, res, next) {
    index_1.renderWithAlerts(req, res, "login", {
        admin: req.user
    });
});
// Handle login POST
administration.post("/login", passport.authenticate("administration-login", {
    successRedirect: "/administration",
    failureRedirect: "/administration/login",
    failureFlash: true
}), function (req, res, next) {
    req.session.save(function (err) {
        if (err) {
            console.log("Login error: " + err);
            return next(err);
        }
        res.redirect("/administration");
    });
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = administration;
//# sourceMappingURL=administration.js.map