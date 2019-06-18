const path = require('path');
const bcrypt = require("bcryptjs");
const User = require("../models/user");



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
    const {
        username,
        password
    } = req.body;
    User.findOne({username})
        .then(user => {
            bcrypt
                .compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save(err => {
                            console.log(err);
                            res.redirect("/");
                        });
                    }

                })
                .catch(err => {
                    console.log(err);
                    req.flash("error", "invalid email or password.");
                    res.redirect("/login");
                })
        })
        .catch(err => {
            console.log(err);
            req.flash("error", "Invalid email or password.");
            return res.redirect("/login");
        });
}


exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect("/");
    })
}

exports.postSignup = (req, res, next) => {
    const {
        username,
        password
    } = req.body;
    User.findOne({username})
        .then(user => {
       if (user === null) {
        throw "";
       } else {
              req.flash("error", "email exists already, please pick a different one.");
                return res.redirect("/signup")
       }
        })
        .catch(() => {
            return bcrypt
                .hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        username: username,
                        password: hashedPassword
                    });
                    return user.save();
                })
                .then(result => {
                    res.redirect("/login");
                })
                .catch(err => {
                    console.log(err);
                })
        })
}