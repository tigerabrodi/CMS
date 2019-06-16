const path = require('path');
const bcrypt = require("bcryptjs");
const User = require("../models/user");

exports.getMyPostsPage = (req, res) => {
    res.render("admin/myposts", {
        path: "/myposts",
        pageTitle: "myposts",
        isAuthenticated: req.session.isLoggedIn
    })
}

exports.getCreatepostPage = (req, res) => {
    res.render("admin/createpost", {
        path: "/createpost",
        pageTitle: "createpost",
        isAuthenticated: req.session.isLoggedIn
    });
}


exports.getPostsPage = (req, res) => {
    res.render("admin/posts", {
        path: "/posts",
        pageTitle: "posts",
        isAuthenticated: req.session.isLoggedIn
    });
}


















