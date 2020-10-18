const Log = require("../models/log");

const { validationResult } = require("express-validator");
function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
}
exports.getfromIFFFT = (req, res, next) => {
  const currentTime = new Date();
  console.log(req.body); // Call your action on the request here
  let Message = req.body;
  if (isEmpty(Message)) {
    //get request does not have a body
    console.log("Movement detected front door");
    Message = "Movement detected front door";
  }
  const CalledBy = "Webhook GET";
  const logitem = new Log(null, currentTime, CalledBy, Message);
  console.log("logitem is: ", logitem);
  logitem
    .save()
    .then(() => {
      console.log("item was saved");
    })
    .catch(err => {
      const error = new Error(err);
      console.log(error);
      error.httpStatusCode = 500;
      return next(error);
    });
  res.status(200).end(); // Responding is important
};

exports.postfromIFFFT = (req, res, next) => {
  const currentTime = new Date();
  console.log(req.body); // Call your action on the request here
  let Message = req.body;
  if (isEmpty(Message)) {
    //get request does not have a body
    console.log("Movement detected front door");
    Message = "Movement detected front door";
  }
  const CalledBy = "Webhook Post";
  const logitem = new Log(null, currentTime, CalledBy, Message);
  console.log("logitem is: ", logitem);
  logitem
    .save()
    .then(() => {
      console.log("item was saved");
    })
    .catch(err => {
      const error = new Error(err);
      console.log(error);
      error.httpStatusCode = 500;
      return next(error);
    });
  res.status(200).end(); // Responding is important
};
