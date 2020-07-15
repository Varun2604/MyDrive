const Router = require('express');

const routes = Router();

//registering v1 router
routes.use("/api/v1", require("./v1"));



module.exports = routes;
