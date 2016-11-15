/// <reference path="../../typings/index.d.ts" />
"use strict";
var express_1 = require('express');
var index = express_1.Router();
var passport = require('passport');
var model = require('../model');
/* GET home page. */
index.get('/', function (req, res, next) {
    res.render('index', {
        guest: req.user
    });
});
/* GET Quick Start. */
index.get('/quickstart', function (req, res, next) {
    res.render('quickstart');
});
index.get('/login', function (req, res, next) {
    res.render('login', {
        guest: req.user,
        error: req.flash('error')
    });
});
index.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
}), function (req, res, next) {
    req.session.save(function (err) {
        if (err) {
            return next(err);
        }
        else {
            res.redirect("/");
        }
    });
});
index.get("/logout", function (req, res, next) {
    req.logout();
    req.session.save(function (err) {
        if (err) {
            return next(err);
        }
        else {
            res.redirect('/');
        }
    });
});
/*
index.get('/',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res, next) {
    console.log(req.user)
    res.render('index', { guest: req.user });
  });
  */
index.get("/signup", function (req, res, next) {
    res.render("signup", {});
});
index.post("/signup", function (req, res, next) {
    console.log("SIGNUP POST", req.body);
    model.guests.create(req.body, function (err, guest) {
        if (err) {
            return res.render('signup', { error: err.message });
        }
        else {
            passport.authenticate('local', {
                successRedirect: "/",
                failureRedirect: "/signup"
            })(req, res, function () {
                req.session.save(function (err) {
                    if (err) {
                        return next(err);
                    }
                    else {
                        res.redirect('/');
                    }
                });
            });
        }
    });
});
index.get('/ping', function (req, res) {
    res.status(200).send("pong");
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = index;
//# sourceMappingURL=index.js.map