/// <reference path="../../typings/index.d.ts" />
"use strict";
var express_1 = require('express');
var index = express_1.Router();
var passport = require('passport');
// GET home page
index.get('/', function (req, res, next) {
    res.render('index', {
        guest: req.user
    });
});
// GET login page
index.get('/login', function (req, res, next) {
    res.render('login', {
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
        return res.redirect("/");
    });
});
// GET signup page
index.get('/signup', function (req, res, next) {
    res.render('signup', {
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
        return res.redirect("/");
    });
});
index.get("/logout", function (req, res, next) {
    req.logout();
    req.session.destroy(function (err) {
        if (err) {
            console.log("Logout error: " + err);
            return next(err);
        }
    });
    req.session.save(function (err) {
        if (err) {
            return next(err);
        }
        return res.redirect('/');
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
/*
index.get(`/signup`, (req, res, next) => {
  res.render(`signup`, {
    guest: req.user
  })
})
*/
index.get('/ping', function (req, res) {
    res.status(200).send("pong");
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = index;
//# sourceMappingURL=index.js.map