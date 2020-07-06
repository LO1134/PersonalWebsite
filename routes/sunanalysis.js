const path = require("path");

const express = require("express");

const { check, body } = require("express-validator");

const sunanalysisController = require("../controllers/sunanalysis");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/sunanalysis", isAuth, sunanalysisController.getresults);

module.exports = router;
