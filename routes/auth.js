const express = require('express');
const {
    check,
    body
} = require("express-validator");
const authController = require("../controllers/auth");
const {
    User
} = require("../models/model");

const router = express.Router();


router.get("/signup", authController.getsignUpPage);

router.get("/login", authController.getLoginPage);

router.post("/signup",
    [
        check("name", "Please, your name has to be more than 5 chars")
        .isLength({min: 5}),
        check("email")
        .isEmail()
        .withMessage('Please enter a valid email.')
        .custom((value, {
            req
        }) => {
            return User.findOne({
                email: value
            }).then(userDoc => {
                if (userDoc) {
                    return Promise.reject("E-Mail exists already, please pick a different one.");
                }
            })

        })
        .normalizeEmail(),
        body("password", "please enter a password with only numbers and text and at least 5 characters.")
        .isLength({
            min: 5
        })
        .isAlphanumeric()
        .trim()
    ],
    authController.postSignup);

router.post("/login",
    [
        body("email")
        .isEmail()
        .withMessage("Please enter a valid email address.")
        .normalizeEmail(),
        body("password", "password has to be valid.")
        .isLength({
            min: 5
        })
        .isAlphanumeric()
        .trim()
    ],
    authController.postLogin);

router.get("/logout", authController.getLogout);


module.exports = router;