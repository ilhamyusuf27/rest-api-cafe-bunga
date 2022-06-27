const Router = require('express').Router();
const controller = require('../controller/usersController');
const userMulter = require('../middleware/userUpload');

Router.get('/users', controller.getDataUsers);
Router.get('/users/id', controller.getDataById);
Router.post('/registration', userMulter, controller.insertNewUser);
Router.post('/add-user', controller.addUser);
Router.patch('/users/update', controller.updateUser);
Router.delete('/users/delete', controller.deleteUser);

module.exports = Router;
