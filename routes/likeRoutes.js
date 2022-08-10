const Router = require("express").Router();
const controller = require("../controller/likeController");
const recipeUpload = require("../middleware/recipeUpload");
const { authenticationToken } = require("../middleware/authenticate");

Router.patch("/recipes/like", authenticationToken, recipeUpload, controller.likedRecipe);
Router.patch("/recipes/un-like", authenticationToken, recipeUpload, controller.unLikedRecipe);
Router.patch("/recipes/like-detail", authenticationToken, recipeUpload, controller.likedRecipeDetail);
Router.patch("/recipes/un-like-detail", authenticationToken, recipeUpload, controller.unLikedRecipeDetail);
Router.get("/recipes/liked/:id", controller.getDataLiked);

module.exports = Router;
