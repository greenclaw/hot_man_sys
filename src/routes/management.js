/// <reference path="../../typings/index.d.ts" />
"use strict";
var express_1 = require('express');
var management = express_1.Router();
var passport = require('passport');
var model = require('../model');
var index_1 = require('./index');
// GET index page if logged in
// redirect to login page if not
management.get('/', function (req, res, next) {
    if (req.user) {
        return model.selectOne("hotels", "hotel_id", req.user.hotel_id, function (err, hotels) {
            index_1.renderWithAlerts(req, res, "management", {
                manager: req.user,
                hotels: hotels
            });
        });
    }
    res.redirect("/management/login");
});
// GET login page
management.get('/login', function (req, res, next) {
    index_1.renderWithAlerts(req, res, "login", {
        manager: req.user
    });
});
// Handle login POST
management.post("/login", passport.authenticate("management-login", {
    successRedirect: "/management",
    failureRedirect: "/management/login",
    failureFlash: true
}), function (req, res, next) {
    req.session.save(function (err) {
        if (err) {
            console.log("Login error: " + err);
            return next(err);
        }
        res.redirect("/management");
    });
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = management;
//# sourceMappingURL=management.js.map