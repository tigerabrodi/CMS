const path = require('path');
const bcrypt = require("bcryptjs");
const {
    User,
    Post
} = require("../models/model");
const passport = require("passport");
const _ = require('lodash');

const {
    validationResult
} = require("express-validator");


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
        errorMessage: getErrorMessage(req),
        oldInput: {
            email: "",
            password: ""
        },
        validationErrors: []
    });
}


exports.getsignUpPage = (req, res) => {
    res.render("blog/signup", {
        pageTitle: "signup",
        path: "/signup",
        errorMessage: getErrorMessage(req),
        oldInput: {
            email: "",
            password: "",
        },
        validationErrors: []
    });
}


exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('blog/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email: email,
                password: password
            },
            validationErrors: errors.array()
        });
    }

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
        name,
        email,
        password
    } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render('blog/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            errorMessage: errors.array()[0].msg,
            oldInput: {
                name,
                email,
                password,
            },
            validationErrors: errors.array()
        });
    }

    const user = new User({
        name,
        email,
        password,
    })

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