const path = require('path');
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const passport = require("passport");


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
        successRedirect: '/',
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
        email,
        password
    } = req.body;

    const user = new User({
        email,
        password
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