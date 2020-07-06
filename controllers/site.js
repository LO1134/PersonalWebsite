const Site = require("../models/site");
const Logtab = require("../models/logtab");
const Log = require("../models/log");
const Picture = require("../models/picureoftheday");

exports.getIndex = (req, res, next) => {
  Picture.fetch_last_item_from_PictureOfTheDay()
    .then(([rows, fieldData]) => {
      const pictureLink = rows[0].link;
      Site.fetchAll(req.session.user[0].id)
        .then(([rows, fieldData]) => {
          res.render("site/index", {
            sites: rows,
            pageTitle: "Site",
            picture: pictureLink,
            path: "/",
          });
        })
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

exports.getloggedin = (req, res, next) => {
  Logtab.fetchAlls()
    .then(([rows, fieldData]) => {
      res.render("site/loggedin", {
        entries: rows,
        pageTitle: "Who loggedin?",
        path: "/loggedin",
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getlog = (req, res, next) => {
  Log.fetchAlls()
    .then(([rows, fieldData]) => {
      res.render("log/index", {
        entries: rows,
        pageTitle: "Site log",
        path: "/log",
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
