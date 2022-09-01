const Router = require("express").Router();
const controller = require("../controller/recipeController");
const recipeUpload = require("../middleware/recipeUpload");
const { authenticationToken } = require("../middleware/authenticate");

Router.get("/recipes", controller.getAllDataRecipe);
Router.get("/recipes/all", controller.getAllDataWithoutPagination);
Router.get("/recipes/popular", controller.getDataPopular);
Router.post("/recipe/id", controller.getRecipeByUserId);
Router.get("/recipe/id/:id", controller.getRecipeByIdParams);
Router.post("/recipe/recipe-id", controller.getRecipeById);
Router.post("/recipes/add", authenticationToken, recipeUpload, controller.insertNewRecipe);
Router.get("/recipe/trending", controller.recipeTrending);
Router.get("/recipes/find/:title", controller.getDataByTitle);
Router.get("/recipes/comments", controller.getDataWithComment);
Router.patch("/recipes/edit", authenticationToken, recipeUpload, controller.updateRecipe);
Router.delete("/delete/recipe/:id", authenticationToken, controller.deleteDataRecipe);

module.exports = Router;
