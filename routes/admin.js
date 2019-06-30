const express = require('express');

const adminController = require("../controllers/admin")

const router = express.Router();

const isAuth = require("../middleware/is-auth");



router.get("/", adminController.getPostsPage);

router.get("/myposts", adminController.getMyPostsPage);

router.get("/create", adminController.getCreatepostPage);

router.get("/posts/:postId", adminController.getPost);

router.get("/posts/edit-post/:postId", adminController.getEditPost);

router.get("/posts/deleted-post/:postId", adminController.getDeletePost);

router.get("/settings", adminController.getSettings);

router.get("/settings/email", adminController.getChangeEmail);

router.get("/settings/password", adminController.getChangePassword);

router.get("/settings/delete-account", adminController.getDeleteAccount);

router.post("/settings/deleted-account/:userId", adminController.postDeletedAccount)

router.post("/settings/changed-password/:userId", adminController.postChangedPassword);

router.post("/settings/changed-email/:userId", adminController.postChangedEmail);

router.post("/posts/edit-post", adminController.postEditPost);

router.post("/posts", adminController.postCreatePost)



module.exports = router;