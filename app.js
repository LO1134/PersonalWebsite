const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");

const errorController = require("./controllers/error");
// const db = require("./util/database");

const app = express();

const csrfProtection = csrf();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    // cb(null, new Date().toISOString() + "-" + file.originalname);
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.set("view engine", "ejs");
app.set("views", "views");

const testRoutes = require("./routes/test");
const sunanalysisRoutes = require("./routes/sunanalysis");
const adminRoutes = require("./routes/admin");
const siteRoutes = require("./routes/site");
const sonoffRoutes = require("./routes/sonoff");
const energieloggingRoutes = require("./routes/energielogging");
const authRoutes = require("./routes/auth");
const apiRoutes = require("./routes/api");
const temperatureRoutes = require("./routes/temperaturelogging");
const webhookRoutes = require("./routes/webhook");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

app.use(express.static(path.join(__dirname, "public")));

app.use("/images", express.static(path.join(__dirname, "images")));

app.use(
  session({
    secret: `${process.env.SESSION_SECRET}`,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedin;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.get("/500", errorController.get500);

app.use((error, req, res, next) => {
  console.log(error);
  res.redirect("/500");
});

app.use("/admin", adminRoutes);
app.use(siteRoutes);
app.use(energieloggingRoutes);
app.use(sonoffRoutes);
app.use(authRoutes);
app.use(apiRoutes);
app.use(testRoutes);
app.use(temperatureRoutes);
app.use(sunanalysisRoutes);
app.use(webhookRoutes);
app.use(errorController.get404);

app.listen(3010);
