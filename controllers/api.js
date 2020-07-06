const Sonoff = require("../models/sonoff");
const { graphql, buildSchema } = require("graphql");
const { sonoffSchema, sonoffQuery } = require("../schema/index")(buildSchema);

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
