const Router = require('express').Router();
const controller = require('../controller/loginController');

Router.post('/login', controller.login);

module.exports = Router;
