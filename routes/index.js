const Router = require('express');

const routes = Router();

module.exports = (app)=>{
    routes.locals = app.locals;

    //registering v1 routers
    routes.use("/api/v1", require("./v1").api_router(app));
    routes.use("/v1", require("./v1").non_api_router(app));

    return routes
};
