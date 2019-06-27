const express = require('express');

const authController = require("../controllers/auth");

const router = express.Router();


router.get("/signup", authController.getsignUpPage);

router.get("/login", authController.getLoginPage);

router.post("/signup", authController.postSignup);

router.post("/login", authController.postLogin);

router.get("/logout", authController.getLogout);


module.exports = router;