const path = require("path");

const express = require("express");
// const { check, body } = require("express-validator");

const temperatureController = require("../controllers/temperaturelogging");

const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/temperaturelogging", isAuth, temperatureController.getIndex);

module.exports = router;
