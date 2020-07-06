const { validationResult } = require("express-validator");

exports.getresults = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("sunperdayanalysis/index", {
    pageTitle: "sunperdayanalysis site",
    path: "/sunperdayanalysis/index",
    editing: false,
    errorMessage: message,
    validationsErrors: [],
  });
};
