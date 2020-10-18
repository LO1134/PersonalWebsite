const User = require("../models/user");
const Logtab = require("../models/logtab");
const Picture = require("../models/picureoftheday");

const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  Picture.fetch_last_item_from_PictureOfTheDay()
    .then(([rows, fieldData]) => {
      res.render("auth/login", {
        path: "/login",
        pageTitle: "Login",
        errorMessage: message,
        picture: rows[0].link,
        description: rows[0].description,
        oldInput: {
          email: "",
          password: "",
        },
        validationsErrors: [],
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: message,
    oldInput: { email: "", name: "", password: "", confirmPassword: "" },
    validationsErrors: [],
  });
};

exports.postSignup = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        name: name,
        password: password,
        confirmPassword: req.body.confirmPassword,
      },
      validationsErrors: errors.array(),
    });
  }
  bcrypt
    .hash(password, 12)
    .then(hashedPassword => {
      const user = new User(null, name, email, hashedPassword);
      user.save();
      console.log("item added to the database", hashedPassword);
      res.redirect("/login");
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect("/login");
  });
};

logItemInLogtab = (email, password, result, ipaddress) => {
  const currentTime = new Date();
  if (ipaddress.substring(0, 7) === "::ffff:") {
    ipaddress = ipaddress.substring(7, 21);
  }
  if (ipaddress !== "217.19.24.81" && ipaddress !== "::1") {
    const logitem = new Logtab(
      null,
      email,
      currentTime,
      result,
      password,
      ipaddress
    );
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
  }
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logItemInLogtab(email, password, 0, req.ip);
    return res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      errorMessage: errors.array()[0].msg,
      picture:
        "https://thumbs.dreamstime.com/b/circle-do-not-enter-sign-wrong-way-octagonal-no-entry-vector-illustration-187335681.jpg",
      description: " ",
      oldInput: {
        email: email,
        password: password,
      },
      validationsErrors: errors.array(),
    });
  }
  // log inlog details

  User.findByEmail(email)
    .then(([rows, fieldData]) => {
      if (rows.length <= 0) {
        //user not found
        logItemInLogtab(email, password, 0, req.ip);
        return res.status(422).render("auth/login", {
          path: "/login",
          pageTitle: "Login",
          errorMessage: "Invalid email or password.",
          picture:
            "https://www.insidefranchisesuccess.com/wp-content/uploads/2017/10/questions.jpg",
          description: " ",
          oldInput: {
            email: email,
            password: password,
          },
          validationsErrors: [{ param: "email" }],
          // validationsErrors: [] // leeg, want je wilt niet vertellen welk veld niet goed was.
        });
      }
      bcrypt
        .compare(password, rows[0].password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedin = true;
            logItemInLogtab(email, password, 1, req.ip);
            req.session.user = rows;
            res.redirect("/");
          } else {
            logItemInLogtab(email, password, 0, req.ip);
            return res.status(422).render("auth/login", {
              path: "/login",
              pageTitle: "Login",
              errorMessage: "Invalid email or password.",
              picture:
                "https://www.insidefranchisesuccess.com/wp-content/uploads/2017/10/questions.jpg",
              description: " ",
              oldInput: {
                email: email,
                password: password,
              },
              // validationsErrors: [{param: 'email', param: 'password'}]
              validationsErrors: [{ param: "password" }], // beter leeg laten, want je wilt geen tip geven.
            });
          }
        })
        .catch(err => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
