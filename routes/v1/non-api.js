const Router = require('express');
const {FileController, UserController, AssetController} = require('../../controllers/v1');
const auth = require("./auth");
//registering all v1 router to v1 router.
const v1_router = Router();

// //adding v1 auth mechanism - Bearer Auth with jwt
// v1_router.use(auth);

//registering user routes
v1_router.post('/signup', UserController.create);
v1_router.post('/generate_token', UserController.generateToken);

module.exports = (app)=>{
    v1_router.locals = app.locals;
    return v1_router
};
