const path = require("path");

const express = require("express");
const apiController = require("../controllers/api");
const graphQlHttp = require("express-graphql");
const graphQlSchema = require("../schema/index2");
const graphQlResolvers = require("../resolvers/index");
const { graphql, buildSchema } = require("graphql");
const { sonoffSchema, sonoffQuery } = require("../schema/index")(buildSchema);
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/API/sonoffs", isAuth, apiController.getSonoffDataOnly);

router.use(
  "/graphql",
  graphQlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
  })
);

module.exports = router;
