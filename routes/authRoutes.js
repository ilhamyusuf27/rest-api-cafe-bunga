const Router = require("express").Router();
const controller = require("../controller/authController");
const { authenticationToken } = require("../middleware/authenticate");

Router.post("/login", controller.login);
Router.post("/registration", controller.insertNewUser);
Router.get("/user/verify-email", controller.verifiedEmail);
Router.get("/refresh-token", authenticationToken, controller.refreshToken);
Router.post("/send-mail", controller.sendEmails);

module.exports = Router;
