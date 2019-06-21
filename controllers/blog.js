const path = require('path');
const bcrypt = require('bcryptjs');

exports.getHomePage = (req, res) => {
    res.render("blog/home", {
        path: "/",
        pageTitle: "home",
    });
}