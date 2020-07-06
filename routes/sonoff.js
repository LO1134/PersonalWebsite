const path = require("path");

const express = require("express");
const { check, body } = require("express-validator");

const sonoffController = require("../controllers/sonoff");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/sonoff", isAuth, sonoffController.getIndex);

router.get("/sonoffs/:sonoffId", sonoffController.getSonoff);

router.get(
  "/sonoff_schedules_delete/:id",
  isAuth,
  sonoffController.getSonoffDeleteSchedule
);

router.get(
  "/sonoff_schedules_delete_confirmed/:id",
  isAuth,
  sonoffController.getSonoffDeleteScheduleConfirmed
);

router.get(
  "/sonoff_schedules/:sonoffId",
  isAuth,
  sonoffController.getSonoffSchedules
);

router.get(
  "/sonoff_change/:sonoffId",
  isAuth,
  sonoffController.getSonoffChange
);

router.post(
  "/sonoff_schedules",
  isAuth,
  [
    check("OnorOff", "Please enter a valid action").not().isEmpty(),
    check("tijdstip", "Please enter a valid time").not().isEmpty()
  ],
  sonoffController.postAdd_a_new_SonoffSchedule
);

router.post(
  "/sonoff_change/:sonoffId",
  isAuth,
  [
    check("OnorOff", "Please enter a valid action").not().isEmpty(),
    check("tijdstip", "Please enter a valid time").not().isEmpty()
  ],
  sonoffController.postSonoffChangeSchedule
);

router.post(
  "/sonoff_schedule_status_change/:id",
  isAuth,
  sonoffController.ChangeActivationSchedueItem
);

router.post("/sonoff/:id", isAuth, sonoffController.SendMQTTCommand);

module.exports = router;
