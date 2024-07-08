const routes = require("express").Router();
routes.use(require("./user"));
routes.use(require("./book"));

module.exports = routes;
