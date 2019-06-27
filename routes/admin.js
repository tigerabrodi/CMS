const express = require('express');

const adminController = require("../controllers/admin")

const router = express.Router();

const isAuth = require("../middleware/is-auth");



router.get("/posts", isAuth, adminController.getPostsPage);

router.get("/myposts", isAuth, adminController.getMyPostsPage);

router.get("/create", isAuth, adminController.getCreatepostPage);

router.get("/posts/:postId", adminController.getPost);

router.get("/posts/edit-post/:postId", adminController.getEditPost);

router.get("/posts/deleted-post/:postId", adminController.getDeletePost);

router.post("/posts/edit-post", adminController.postEditPost);

router.post("/posts", adminController.postCreatePost)



module.exports = router;