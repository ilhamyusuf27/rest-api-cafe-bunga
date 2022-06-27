const Router = require('express').Router();
const controller = require('../controller/recipeController');
const recipeUpload = require('../middleware/recipeUpload');

Router.get('/recipes', controller.getAllDataRecipe);
Router.post('/recipes/add', recipeUpload, controller.insertNewRecipe);
Router.get('/recipe/trending', controller.recipeTrending);
Router.get('/recipes/find', controller.getDataByTitle);
Router.get('/recipes/comments', controller.getDataWithComment);
Router.patch('/recipes/edit', controller.updateRecipe);
Router.delete('/recipes/delete', controller.deleteDataRecipe);

module.exports = Router;
