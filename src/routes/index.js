/// <reference path="../../typings/index.d.ts" />
"use strict";
var express_1 = require('express');
var index = express_1.Router();
var passport = require('passport');
var model = require('../model');
function renderWithAlerts(req, res, view, options) {
    res.render(view, Object.assign({
        danger: req.flash("danger"),
        warning: req.flash("warning"),
        info: req.flash("info"),
        success: req.flash("success")
    }, options));
}
exports.renderWithAlerts = renderWithAlerts;
// GET index page
index.get('/', function (req, res, next) {
    model.selectAll("hotels", function (err, hotels) {
        renderWithAlerts(req, res, "index", {
            title: "(\u3063\u25D5\u203F\u25D5)\u3063 HotManSys",
            guest: req.user,
            hotels: hotels
        });
    });
});
// Handle index POST
index.post("/", function (req, res, next) {
    model.hotels.selectUnreservedRooms(req.body, function (err, roomReservs) {
        renderWithAlerts(req, res, "index", {
            guest: req.user,
            roomReservs: roomReservs
        });
    });
});
// GET login page
index.get('/login', function (req, res, next) {
    renderWithAlerts(req, res, "login", {
        guest: req.user
    });
});
// Handle login POST
index.post("/login", passport.authenticate("login", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}), function (req, res, next) {
    req.session.save(function (err) {
        if (err) {
            console.log("Login error: " + err);
            return next(err);
        }
        res.redirect("/");
    });
});
// GET signup page
index.get('/signup', function (req, res, next) {
    renderWithAlerts(req, res, "signup", {
        guest: req.user
    });
});
// Handle signup POST
index.post("/signup", passport.authenticate("signup", {
    successRedirect: "/",
    failureRedirect: "/signup",
    failureFlash: true
}), function (req, res, next) {
    req.session.save(function (err) {
        if (err) {
            console.log("Signup error: " + err);
            return next(err);
        }
        res.redirect("/");
    });
});
// Hadle logging out
index.get("/logout", function (req, res, next) {
    req.logout();
    req.session.destroy(function (err) {
        if (err) {
            console.log("Logout error: " + err);
            return next(err);
        }
        res.redirect('/');
    });
});
// GET profile page
index.get('/profile', function (req, res, next) {
    renderWithAlerts(req, res, "profile", {
        guest: req.user
    });
});
// GET reservations page
index.get('/reservations', function (req, res, next) {
    renderWithAlerts(req, res, "reservations", {
        guest: req.user
    });
});
index.get('/ping', function (req, res) {
    res.status(200).send("pong");
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = index;
//# sourceMappingURL=index.js.map