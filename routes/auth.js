const express = require("express");

const { check, body } = require("express-validator");

const authController = require("../controllers/auth");

const User = require("../models/user");

const router = express.Router();

router.get("/login", authController.getLogin);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address.")
      .normalizeEmail(),
    body("password", "Password has to be valid.")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim()
  ],
  authController.postLogin
);

router.get("/signup", authController.getSignup);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter an invalid email.")
      .custom((value, { req }) => {
        // if (value === "test@test.com") {
        //   throw new Error("This email address is forbidden");
        // }
        // return true;
        return User.findByEmail(value).then(([rows, fieldData]) => {
          if (rows.length > 0) {
            return Promise.reject(
              "E-mail exists already. Please use another e-mail address."
            );
          }
        });
      })
      .normalizeEmail(),
    body(
      "password",
      "Pleae enter a valid password, must be a minimum of 5 characters."
    )
      .isLength({ min: 5 })
      .isString()
      .trim(),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords have to be identical.");
        }
        return true;
      }),
    check("name", "Please fill in a valid name")
      .isLength({ min: 1 })
      .isString()
  ],
  authController.postSignup
);

router.post("/logout", authController.postLogout);
module.exports = router;
