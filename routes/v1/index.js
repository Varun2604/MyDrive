const Router = require('express');
const {FileController, UserController, AssetController} = require('../../controllers/v1');

//registering all v1 router to v1 router.
const v1_router = Router();

//registering user routes
v1_router.post('/users', UserController.create);
v1_router.get('/users/:id', UserController.get);
v1_router.put('/users/:id', UserController.update);
v1_router.delete('/users/:id', UserController.delete);

//registering file routes
v1_router.post('/files', FileController.create);
v1_router.get('/files/:id', FileController.get);
v1_router.get('/files', FileController.getAll);
v1_router.put('/files/:id', FileController.update);
v1_router.delete('/files/:id', FileController.delete);

//registering asset routes
v1_router.post('/assets', AssetController.create);
v1_router.get('/assets/:id', AssetController.get);

module.exports = v1_router;
