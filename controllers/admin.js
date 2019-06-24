const path = require('path');
const bcrypt = require("bcryptjs");

exports.getMyPostsPage = (req, res) => {
    res.render("admin/myposts", {
        path: "/myposts",
        pageTitle: "My Posts",
    })
}

exports.getCreatepostPage = (req, res) => {
    res.render("admin/createpost", {
        path: "/createpost",
        pageTitle: "Create",
    });
}


exports.getPostsPage = (req, res) => {
    res.render("admin/posts", {
        path: "/",
        pageTitle: "Posts",
    });
}
