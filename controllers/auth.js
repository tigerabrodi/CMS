const path = require('path');
const bcrypt = require("bcryptjs");
const User = require("../models/user");

exports.getLoginPage = (req, res) => {
    res.render("blog/login", {
        pageTitle: "login",
        path: "/login",
        errorMessage: message
    });
}

exports.getsignUpPage = (req, res) => {
    let message = req.flash("error");
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render("blog/signup", {
        pageTitle: "signup",
        path: "/signup",
        errorMessage: message
    });
}


exports.postLogin = (req, res, next) => {
    const {
        username,
        password
    } = req.body;
    User.findOne({
            username: username
        })
        .then(user => {
            if (!user) {
                req.flash("error", "Invalid email or password.");
                return res.redirect("/login");
            }
            bcrypt
                .compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save(err => {
                            console.log(err);
                            res.render("admin/myposts", {
                                path: "myposts",
                                pageTitle: "myposts"
                            })
                        });
                    }
                    req.flash("error", "invalid email or password.");
                    res.redirect("/login");
                })
                .catch(err => {
                    console.log(err);
                    res.redirect("/login");
                })
        })
        .catch(err => console.log);
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
    User.findOne({
            username: username
        })
        .then(userDoc => {
            if (userDoc) {
                req.flash("error", "email exists already, please pick a different one.");
                return res.redirect("/signup"); 
                console.log(userDoc);
            }
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