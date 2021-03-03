const path = require("path");

const express = require("express");

const isAuth = require("../middleware/is-auth");
const webhookController = require("../controllers/webhook");

const router = express.Router();

// router.use("/hook", (req, res) => {
//   console.log(req.body); // Call your action on the request here
//   res.status(200).end(); // Responding is important
// });

// router.use("/hook", isAuth, webhookController.postfromIFFFT);
router.get("/hook", webhookController.getfromIFFFT);

router.post("/hook", webhookController.postfromIFFFT);
module.exports = router;
