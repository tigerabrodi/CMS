const path = require('path');
const bcrypt = require("bcryptjs");
const {
    User,
    Post
} = require("../models/model");
const passport = require("passport");
const _ = require('lodash');


function getErrorMessage(req) {
    let message = req.flash("error");
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    return message;
}


exports.getLoginPage = (req, res) => {
    res.render("blog/login", {
        pageTitle: "login",
        path: "/login",
        errorMessage: getErrorMessage(req)
    });
}


exports.getsignUpPage = (req, res) => {
    res.render("blog/signup", {
        pageTitle: "signup",
        path: "/signup",
        errorMessage: getErrorMessage(req)
    });
}


exports.postLogin = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/posts',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
}


exports.getLogout = (req, res, next) => {
    req.logout();
    res.redirect("/");
}


exports.postSignup = (req, res, next) => {

    const {
        name,
        email,
        password,
    } = req.body;

    const user = new User({
        name,
        email,
        password,
    });

    User.findOne({
        email
    }, (err, userExists) => {
        if (err) return next(err);
        if (userExists) {
            req.flash("error", "Email exists already, please pick a different one.");

            return res.redirect("/signup");
        }
        user.save()
            .then(user => {
                res.redirect("/login");
            })
            .catch(err => console.log(err));
    });
};