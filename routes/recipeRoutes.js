const Router = require('express').Router();
const controller = require('../controller/recipeController');
const multer = require('multer');

const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, './images/recipes/');
	},
	filename: (req, file, cb) => {
		cb(null, new Date().getTime() + '-' + file.originalname);
	},
});

const upload = multer({ storage: fileStorage });

Router.get('/recipes', controller.getAllDataRecipe);
Router.post('/recipes/add', upload.single('recipe_images'), controller.insertNewRecipe);
Router.get('/recipes/find', controller.getDataByTitle);
Router.get('/recipes/comments', controller.getDataWithComment);
Router.patch('/recipes/edit', controller.updateRecipe);
Router.delete('/recipes/delete', controller.deleteDataRecipe);

module.exports = Router;
