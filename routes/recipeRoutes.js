const Router = require('express').Router();
const controller = require('../controller/recipeController');
const recipeUpload = require('../middleware/recipeUpload');
const { authenticationToken } = require('../middleware/authenticate');

Router.get('/recipes', controller.getAllDataRecipe);
Router.post('/recipes/add', authenticationToken, recipeUpload, controller.insertNewRecipe);
Router.get('/recipe/trending', controller.recipeTrending);
Router.get('/recipes/find', controller.getDataByTitle);
Router.get('/recipes/comments', controller.getDataWithComment);
Router.patch('/recipes/edit', authenticationToken, recipeUpload, controller.updateRecipe);
Router.delete('/recipes/delete', authenticationToken, controller.deleteDataRecipe);

module.exports = Router;
