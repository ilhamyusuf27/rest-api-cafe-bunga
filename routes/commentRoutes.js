const Router = require('express').Router();
const controller = require('../controller/commentController');
const { authenticationToken } = require('../middleware/authenticate');

Router.get('/all-comments', controller.showAllComment);
Router.post('/recipe/:id/comment', authenticationToken, controller.insertComment);
Router.patch('/recipe/comment/edit', authenticationToken, controller.updateComment);
Router.delete('/recipe/comment/delete', authenticationToken, controller.deleteComment);

module.exports = Router;
