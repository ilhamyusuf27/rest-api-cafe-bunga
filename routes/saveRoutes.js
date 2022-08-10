const Router = require("express").Router();
const controller = require("../controller/saveController");
const recipeUpload = require("../middleware/recipeUpload");
const { authenticationToken } = require("../middleware/authenticate");

Router.patch("/recipes/save", authenticationToken, recipeUpload, controller.saveRecipe);
Router.patch("/recipes/un-save", authenticationToken, recipeUpload, controller.unSaveRecipe);
Router.patch("/recipes/save-detail", authenticationToken, recipeUpload, controller.saveRecipeDetail);
Router.patch("/recipes/un-save-detail", authenticationToken, recipeUpload, controller.unSaveRecipeDetail);
Router.get("/recipes/save/:id", controller.getDataSave);

module.exports = Router;
