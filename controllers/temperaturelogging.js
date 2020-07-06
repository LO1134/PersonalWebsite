exports.getIndex = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("temperaturelogging/index", {
    pageTitle: "TemperatureLogging",
    path: "/temperaturelogging",
    editing: false,
    errorMessage: message,
    validationsErrors: []
  });
};
