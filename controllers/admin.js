const path = require('path');
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const _ = require("lodash");
const {
    User,
    Post,
    Comment,
} = require("../models/model");


function getErrorMessage(req) {
    let message = req.flash("error");
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    return message;
}

exports.getMyPostsPage = async (req, res) => {
    const posts = await Post.find({
        author: req.user._id
    })
    res.render("admin/myposts", {
        path: "/myposts",
        pageTitle: "My Posts",
        posts: posts,
    })
}

exports.getCreatepostPage = (req, res) => {
    res.render("admin/createpost", {
        path: "/create",
        pageTitle: "Create",
    });
}


exports.getPostsPage = async (req, res) => {
    try {
        const posts = await Post.find({})

        res.render("admin/posts", {
            path: "/",
            pageTitle: "Posts",
            posts: posts
        });
    } catch (err) {
        console.log(err);
    }
}

exports.postCreatePost = async (req, res) => {

    const {
        title,
        description,
        context
    } = req.body;

    const post = new Post({
        title,
        description,
        context,
        author: req.user
    });

    try {
        const savedPost = await post.save()
        const usersPost = await req.user.posts.push(post);
        console.log(req.user.posts)
        const posts = await Post.find({})
        res.render("admin/posts", {
            pageTitle: "Posts",
            path: "/posts",
            posts: posts
        })
        console.log(post.author);
    } catch (err) {
        console.log(err);
    }

}

exports.getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        const comments = await Comment.find({
            postId: post._id
        });
        const user = await User.findOne({_id: post.author});
        const users = await User.find()
        res.render("admin/post", {
            post: post,
            pageTitle: post.title,
            path: "/posts",
            comments: comments,
            user: user,
            users: users
        });
    } catch (err) {
        console.log(err);
    }
}

exports.getEditPost = async (req, res) => {
    try {
        // const user = await User.findById({
        //     _id: req.user
        // })
        const post = await Post.findById(req.params.postId)
        // if (post.author) {
        res.render("admin/edit-post", {
            pageTitle: "Edit Post",
            path: "/posts/edit-post",
            post: post
        })
        console.log(post);
        // }

    } catch (err) {
        console.log(err);
    }
}

exports.getDeletePost = async (req, res) => {
    try {
        const post = await Post.findByIdAndRemove(req.params.postId)
        // const user = await User.findById({_id: req.user})
        res.render("admin/deleted-post", {
            pageTitle: "Successfully deleted",
            path: "/posts/deleted-post",
            post: post

        })

    } catch (err) {
        console.log(err);
    }
}

exports.postEditPost = async (req, res) => {
    try {
        const postId = req.body.postId;
        const updatedTitle = req.body.title;
        const updatedDescription = req.body.description;
        const updatedContext = req.body.context;

        const post = await Post.findById(postId)
        post.title = updatedTitle;
        post.description = updatedDescription;
        post.context = updatedContext;

        post.save();

        res.redirect("/myposts");
    } catch (err) {
        console.log(err);
    }
}

exports.getSettings = (req, res) => {
    res.render("admin/settings", {
        pageTitle: "Settings",
        path: "/settings",
    })
}

exports.getChangeEmail = (req, res) => {
    res.render("admin/settings/change-email", {
        pageTitle: "Change Your Email",
        path: "/settings/email",
        errorMessage: getErrorMessage(req)
    })
}

exports.postChangedEmail = (req, res) => {

    const {
        newEmail,
        confirmNewEmail
    } = req.body;
    const userId = req.params.userId;
    const user = User.findById(userId)

    if (newEmail === confirmNewEmail) {
        user.email = newEmail;
        res.render("admin/settings/appliedSettings/changed-email", {
            pageTitle: "Succesfully Changed Email",
            path: "/settings/changed-email",
            user: user
        })
        user.save();
    } else {
        req.flash("error", "Emails do not match!");
        res.redirect("/settings/email");
    }
}

exports.getChangePassword = (req, res) => {
    res.render("admin/settings/change-password", {
        pageTitle: "Change Your Email",
        path: "/settings/email",
        errorMessage: getErrorMessage(req)
    });
}

exports.postChangedPassword = async (req, res) => {

    const {
        oldPassword,
        newPassword,
        confirmNewPassword
    } = req.body;

    const user = await User.findById(req.params.userId);

    bcrypt.compare(oldPassword, user.password, async (error, isMatch) => {
        if (error) return console.log(error);
        if (!isMatch) {
            req.flash('error', 'Passwords do not match!');
            return res.redirect('/settings/password');
        }
        const newHashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = newHashedPassword;
        user.save();
        res.render("admin/settings/appliedSettings/changed-password", {
            pageTitle: "Succesfully Changed Password",
            path: "/settings/changed-password",
            user: user
        })
    })
}

exports.getDeleteAccount = (req, res) => {
    res.render("admin/settings/delete-account", {
        pageTitle: "Delete Account",
        path: "/settings/delete-account",
        errorMessage: getErrorMessage(req)
    })
}

exports.postDeletedAccount = async (req, res) => {
    const {
        confirmEmail,
        confirmPassword
    } = req.body;
    const user = await User.findById(req.params.userId);

    bcrypt.compare(confirmPassword, user.password, async (error, isMatch) => {
        if (error) return console.log(error);
        if (!isMatch && confirmEmail !== user.email) {
            req.flash("error", "Email or Password is Incorrect");
            return res.redirect("/settings/delete-account")
        }
        user.remove();
        res.render("admin/settings/appliedSettings/deleted-account", {
            pageTitle: "Successfully Deleted",
            path: "/settings/deleted-account",
            user: user
        })
    })
}

exports.postCreateComment = async (req, res) => {
    const {
        context
    } = req.body;
    try {
        const post = await Post.findById(req.params.postId);

        const comment = new Comment({
            context: context,
            author: req.user.name,
            postId: post._id,
            userId: req.user._id
        });

        const savedComment = await comment.save();
        const postsComment = await post.comments.push(comment);

        const comments = await Comment.find({
            postId: post._id
        });

        const users = await User.find()

        res.render("admin/post", {
            path: "/posts",
            pageTitle: post.title,
            comments: comments,
            post: post,
            users: users
        });
    } catch (error) {
        console.log(error);
    }
}

exports.getDeleteComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);

        const comment = await Comment.findOne({
            userId: req.user._id,
            postId: post._id
        });

        const deletedComment = await comment.delete();

        console.log(deletedComment);
        console.log(comment);
        res.render("admin/deleted-comment", {
            pageTitle: "Deleted Comment",
            path: "/posts/deleted-comment",
            post: post
        })
    } catch (error) {
        console.log(error);
    }
}