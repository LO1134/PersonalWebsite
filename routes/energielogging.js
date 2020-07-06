const path = require("path");

const express = require("express");
// const { check, body } = require("express-validator");

const energieController = require("../controllers/energielogging");

const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/energielogging", isAuth, energieController.getIndex);

router.get(
  "/energie_daily_overview",
  isAuth,
  energieController.getDailyOverview
);

router.get(
  "/energie_monthly_overview",
  isAuth,
  energieController.getMonthlyOverview
);
module.exports = router;
