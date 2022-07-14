const Router = require('express').Router();
const controller = require('../controller/usersController');
const userMulter = require('../middleware/userUpload');
const { authenticationToken } = require('../middleware/authenticate');

Router.get('/users', controller.getDataUsers);
Router.get('/users/:id', controller.getDataById);
Router.post('/registration', controller.insertNewUser);
Router.patch('/users/update', authenticationToken, userMulter, controller.updateUser);
Router.patch('/users/upload', authenticationToken, userMulter, controller.updateImageUser);
Router.delete('/users/delete', authenticationToken, controller.deleteUser);

module.exports = Router;
