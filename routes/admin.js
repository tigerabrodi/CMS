const path = require('path');

const express = require('express');

const adminController = require("../controllers/admin")

const router = express.Router();

const isAuth = require("../middleware/is-auth");



router.get("/posts", isAuth, adminController.getPostsPage);

router.get("/myposts", isAuth, adminController.getMyPostsPage);

router.get("/createpost", isAuth, adminController.getCreatepostPage);



module.exports = router;