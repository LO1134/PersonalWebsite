const path = require("path");

const express = require("express");

const siteController = require("../controllers/site");

const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/loggedin", isAuth, siteController.getloggedin);

router.get("/log", isAuth, siteController.getlog);

router.get("/", isAuth, siteController.getIndex);

module.exports = router;
