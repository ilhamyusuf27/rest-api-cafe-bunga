const Router = require('express').Router();
const controller = require('../controller/commentController');

Router.get('/all-comments', controller.showAllComment);
Router.post('/recipe/:id/comment', controller.insertComment);
Router.patch('/recipe/comment/edit', controller.updateComment);
Router.delete('/recipe/comment/delete', controller.deleteComment);

module.exports = Router;
