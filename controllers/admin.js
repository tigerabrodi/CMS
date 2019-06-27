const path = require('path');
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const _ = require("lodash");
const {
    User,
    Post,
} = require("../models/model");

exports.getMyPostsPage = async (req, res) => {
    const posts = await Post.find({author: req.user})

    res.render("admin/myposts", {
        path: "/myposts",
        pageTitle: "My Posts",
        posts: posts
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
            path: "/posts",
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
    } catch (err) {
        console.log(err);
    }

}

exports.getPost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const post = await Post.findById(postId)

        res.render("admin/post", {
            post: post,
            pageTitle: post.title,
            path: "/posts",
            user: req.user
        })

    } catch (err) {
        console.log(err);
    }

}

exports.getEditPost = async (req, res) => {
    try {
        const postId = req.params.postId;

        const post = await Post.findById(postId)
        res.render("admin/edit-post", {
            pageTitle: "Edit Post",
            path: "/posts/edit-post",
            post: post
        })
        console.log(post);
    } catch (err) {
        console.log(err);
    }
}

exports.getDeletePost = async (req, res) => {
    try {
        const postId = req.params.postId;

        const post = await Post.findByIdAndRemove(postId)

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