const Router = require('express');
const {FileController, UserController, AssetController} = require('../../controllers/v1');
const auth = require("./auth");
//registering all v1 router to v1 router.
const v1_api_router = Router();

//adding v1 auth mechanism - Bearer Auth with jwt
v1_api_router.use(auth);

//registering user routes
v1_api_router.post('/users', UserController.create);
v1_api_router.get('/users/:id', UserController.get);
v1_api_router.put('/users/:id', UserController.update);
v1_api_router.delete('/users/:id', UserController.delete);

//registering file routes
v1_api_router.post('/files', FileController.create);
v1_api_router.get('/files/:id', FileController.get);
v1_api_router.get('/files', FileController.getAll);
v1_api_router.put('/files/:id', FileController.update);
v1_api_router.delete('/files/:id', FileController.delete);

//registering asset routes
v1_api_router.post('/assets', AssetController.create);
v1_api_router.get('/assets/:id', AssetController.get);

module.exports = (app)=>{
    v1_api_router.locals = app.locals;
    return v1_api_router
};
