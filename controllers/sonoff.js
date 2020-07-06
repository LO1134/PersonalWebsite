const Sonoff = require("../models/sonoff");
const Sonoffevents = require("../models/sonoffSchedule");
const mqtt = require("mqtt");
const { validationResult } = require("express-validator");
const { graphql, buildSchema } = require("graphql");
const { sonoffSchema, sonoffQuery } = require("../schema/index")(buildSchema);

transformAminto24time = timeOfEvent => {
  let hours = Number(timeOfEvent.match(/^(\d+)/)[1]);
  let minutes = Number(timeOfEvent.match(/:(\d+)/)[1]);
  const AMPM = timeOfEvent.match(/\s(.*)$/)[1];
  if (AMPM == "pm" && hours < 12) hours = hours + 12;
  if (AMPM == "am" && hours == 12) hours = hours - 12;
  let sHours = hours.toString();
  let sMinutes = minutes.toString();
  if (hours < 10) sHours = "0" + sHours;
  if (minutes < 10) sMinutes = "0" + sMinutes;
  timeOfEvent = sHours + ":" + sMinutes;
  return timeOfEvent;
};

exports.getIndex = (req, res, next) => {
  Sonoff.fetchAll(req.session.user[0].id)
    .then(([rows, fieldData]) => {
      res.render("sonoff/index", {
        sonoffs: rows,
        pageTitle: "Sonoff",
        path: "/"
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getSonoff = (req, res, next) => {
  const sonId = req.params.sonoffId;
  Sonoff.findById(sonId)
    .then(([rows, fieldData]) => {
      res.render("sonoff/sonoff-detail", {
        sonoff: rows[0],
        pageTitle: rows[0].title,
        path: "/sonoff"
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getSonoffDataOnly = (req, res, next) => {
  // https://steemit.com/graphql/@alien35/creating-a-scalable-api-using-node-graphql-mysql-and-knex
  Sonoff.fetchAll(req.session.user[0].id)
    .then(([rows, fieldData]) => {
      res.setHeader("Content-Type", "application/json");
      graphql(sonoffSchema, sonoffQuery, { sonoffs: rows }).then(response => {
        console.log("response: ", response);
        res.status(200).send(
          JSON.stringify({
            result: response.errors,
            data: response.data
          })
        );
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getSonoffSchedules = (req, res, next) => {
  const sonId = req.params.sonoffId;
  Sonoffevents.fetchAllForDevice(sonId)
    .then(([rows, fieldData]) => {
      // console.log("selected rowsw: ", rows);
      let message = req.flash("error");
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render("sonoff/sonoff-schedule", {
        scheduleItems: rows,
        pageTitle: "Schedular Sonoff",
        path: "/sonoff/sonoff-schedule",
        id: sonId,
        errorMessage: message,
        validationsErrors: [],
        oldInput: {
          dagen: "",
          tijdstip: "",
          action: ""
        }
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getSonoffChange = (req, res, next) => {
  const sonId = req.params.sonoffId;
  Sonoffevents.findById(sonId)
    .then(([rows, fieldData]) => {
      let message = req.flash("error");
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render("sonoff/sonoff-change", {
        changeItems: rows,
        pageTitle: "Add a new schedular Sonoff change",
        path: "/sonoff/sonoff-change",
        id: sonId,
        errorMessage: message,
        validationsErrors: []
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.SendMQTTCommand = (req, res, next) => {
  const id = req.params.id;
  Sonoff.findById(id)
    .then(([rows, fieldData]) => {
      const MQTTtopic = rows[0].MQTTtopic;
      var MQTTCommand = rows[0].MQTTcommand;
      var currentstatus = rows[0].status;
      if (currentstatus == 1) {
        currentstatus = 0;
        MQTTCommand = rows[0].MQTTcommandUIT;
      } else {
        currentstatus = 1;
        MQTTCommand = rows[0].MQTTcommandAAN;
      }
      const client = mqtt.connect(rows[0].host);
      client.on("connect", () => {
        client.publish(MQTTtopic, MQTTCommand);
      });
      res.status(200).json({
        message: "MQTT signal sucessfull transmitted",
        status: currentstatus
      });
      Sonoff.updateId(currentstatus, id)
        .then(([rows, fieldData]) => {})
        .catch(err => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postAdd_a_new_SonoffSchedule = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(
      "there are errors in the input field! display schedules of sonoff"
    );
    console.log("errors.array: ", errors.array()[0].msg);
    const sonId = req.body.sonoffId;
    return Sonoffevents.fetchAllForDevice(sonId)
      .then(([rows, fieldData]) => {
        return res.status(422).render("sonoff/sonoff-schedule", {
          scheduleItems: rows,
          pageTitle: "Schedular Sonoff",
          path: "/sonoff/sonoff-schedule",
          id: sonId,
          errorMessage: errors.array()[0].msg,
          validationsErrors: errors.array()
        });
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  }
  day_ALL = false;
  ma = false;
  di = false;
  wo = false;
  don = false;
  vr = false;
  zo = false;
  za = false;
  if (req.body["weekday-ALL"] == "on") {
    day_ALL = true;
    ma = true;
    di = true;
    wo = true;
    don = true;
    vr = true;
    zo = true;
    za = true;
  }
  if (req.body["weekday-mon"] == "on") {
    ma = true;
  }
  if (req.body["weekday-tue"] == "on") {
    di = true;
  }
  if (req.body["weekday-wed"] == "on") {
    wo = true;
  }
  if (req.body["weekday-thu"] == "on") {
    don = true;
  }
  if (req.body["weekday-fri"] == "on") {
    vr = true;
  }
  if (req.body["weekday-sun"] == "on") {
    zo = true;
  }
  if (req.body["weekday-sat"] == "on") {
    za = true;
  }
  const timestamp = new Date().toISOString();
  const lastChanged = timestamp;
  let timeOfEvent = req.body.tijdstip;
  console.log("timeOfEvent bij een add?", timeOfEvent);
  timeOfEvent = transformAminto24time(timeOfEvent);
  const onOrOff = req.body.OnorOff;
  const status = 0;
  const image = "uit";
  const addedBy = "Initial";
  const sonoffsId = req.body.sonoffId;
  const sonoffEvents = new Sonoffevents(
    null,
    sonoffsId,
    timestamp,
    day_ALL,
    zo,
    ma,
    di,
    wo,
    don,
    vr,
    za,
    timeOfEvent,
    onOrOff,
    lastChanged,
    status,
    image,
    addedBy
  );
  sonoffEvents
    .save()
    .then(() => {
      let actualPage = "/sonoff_schedules/" + sonoffsId;
      res.redirect(actualPage);
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postSonoffChangeSchedule = (req, res, next) => {
  const id = req.body.id;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("there are errors in the input field while changing schedules");
    return Sonoffevents.findById(id)
      .then(([rows, fieldData]) => {
        let message = errors.array()[0].msg;
        return res.render("sonoff/sonoff-change", {
          changeItems: rows,
          pageTitle: "Add a new schedular Sonoff change",
          path: "/sonoff/sonoff-change",
          id: id,
          errorMessage: message,
          validationsErrors: []
        });
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  }
  day_ALL = false;
  ma = false;
  di = false;
  wo = false;
  don = false;
  vr = false;
  zo = false;
  za = false;
  if (req.body["weekday-ALL"] == "on") {
    day_ALL = true;
    ma = true;
    di = true;
    wo = true;
    don = true;
    vr = true;
    zo = true;
    za = true;
  }
  if (req.body["weekday-mon"] == "on") {
    ma = true;
  }
  if (req.body["weekday-tue"] == "on") {
    di = true;
  }
  if (req.body["weekday-wed"] == "on") {
    wo = true;
  }
  if (req.body["weekday-thu"] == "on") {
    don = true;
  }
  if (req.body["weekday-fri"] == "on") {
    vr = true;
  }
  if (req.body["weekday-sun"] == "on") {
    zo = true;
  }
  if (req.body["weekday-sat"] == "on") {
    za = true;
  }
  const lastChanged = new Date().toISOString();
  let timeOfEvent = req.body.tijdstip;
  console.log("timeOfEvent bij een change", timeOfEvent);
  timeOfEvent = transformAminto24time(timeOfEvent);
  const onOrOff = req.body.OnorOff;
  const status = 0;
  const image = "uit";
  const addedBy = "Manual changed";
  Sonoffevents.findById(id).then(([rows, fieldData]) => {
    // console.log("rows[0]: ", rows[0]);
    const timestamp = rows[0].timestamp;
    const sonoffsId = rows[0].sonoffsId;
    const sonoffEvents = new Sonoffevents(
      null,
      sonoffsId,
      timestamp,
      day_ALL,
      zo,
      ma,
      di,
      wo,
      don,
      vr,
      za,
      timeOfEvent,
      onOrOff,
      lastChanged,
      status,
      image,
      addedBy
    );
    Sonoffevents.deleteById(id) //first delete, than add again
      .then(() => {
        sonoffEvents.save().then(() => {
          let actualPage = "/sonoff_schedules/" + sonoffsId;
          res.redirect(actualPage);
        });
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  });
};

exports.getSonoffDeleteSchedule = (req, res, next) => {
  const id = req.params.id;
  Sonoffevents.findById(id).then(([rows, fieldData]) => {
    // console.log(rows[0]);
    const sonoffsId = rows[0].sonoffsId;
    console.log("sonoffsId: ", sonoffsId);
    console.log("id to be deleted: ", id);
    res.render("sonoff/sonoff-delete", {
      pageTitle: "Delete an schedule item:  are you sure?",
      path: "/sonoff/sonoff-delete",
      id: id,
      sonoffsId: sonoffsId
    });
  });
};

exports.getSonoffDeleteScheduleConfirmed = (req, res, next) => {
  const id = req.params.id;
  console.log("id to be deleted: ", id);
  Sonoffevents.findById(id).then(([rows, fieldData]) => {
    const sonoffsId = rows[0].sonoffsId;
    Sonoffevents.deleteById(id)
      .then(() => {
        let actualPage = "/sonoff_schedules/" + sonoffsId;
        res.redirect(actualPage);
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  });
};

exports.ChangeActivationSchedueItem = (req, res, next) => {
  const id = req.params.id;
  console.log("iem to be changed : ", id);
  Sonoffevents.findById(id).then(([rows, fieldData]) => {
    let status = rows[0].status;
    const sonoffsId = rows[0].sonoffsId;
    if (status) {
      console.log("status must be de-activated");
      status = 0;
    } else {
      console.log("status must be activated");
      status = 1;
    }
    Sonoffevents.ChangeStatus(id, status)
      .then(() => {
        res.status(200).json({
          message: "Status changed sucessfully",
          status: status
        });
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  });
};
