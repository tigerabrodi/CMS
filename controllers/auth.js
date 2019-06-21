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


exports.postLogin = async (req, res, next) => {
    const {
        username,
        password
    } = req.body;

    try {
        const user = await User.findOne({
            username
        })
        if (!user) {
            req.flash("error", "Invalid Email or Password.");
            res.redirect("/login");
        }
        const correctCredentials = await bcrypt.compare(password, user.password)

        if (!correctCredentials) {
            req.flash("error", "Invalid Email or Password.");
            res.redirect("/login");
        }


        req.session.isLoggedIn = true;
        req.session.user = user;
        const result = await req.session.save(err => {
            if (err) throw err;
            res.redirect("/");
        });


    } catch (err) {
        console.log(err);
        return req.flash("error", "Invalid Email or Password.");
        res.redirect("/login");
    }
}


exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        if (err) throw err;
        res.redirect("/");
    })
}


exports.postSignup = (req, res, next) => {

    const {
        username,
        password
    } = req.body;

    const user = new User({
        username,
        password
    });

    User.findOne({
        username
    }, (err, userExists) => {
        if (err) return next(err);
        if (userExists) {
            req.flash("error", "Email exists already, please pick a different one.");

            return res.redirect("/signup");
        }

        user.save(error => {
            if (error) return next(error);
            res.redirect("/login");
        });
    });
};




/*      Eh, old hashing way before pre save hook :p  

bcrypt
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
     */