const express = require("express");
require("dotenv").config();
const app = express();
const bodyParser = require("body-parser");
const helmet = require("helmet");
const port = process.env.PORT || 8000;
const cors = require("cors");

const users = require("./routes/usersRoutes");
const recipes = require("./routes/recipeRoutes");
const comments = require("./routes/commentRoutes");
const save = require("./routes/saveRoutes");
const like = require("./routes/likeRoutes");
const auth = require("./routes/authRoutes");

app.use(helmet({ crossOriginResourcePolicy: false }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const corsOptions = {
	origins: "http://localhost:3000/",
};
app.use(cors(corsOptions));

app.use("/images/recipes", express.static("images/recipes"));
app.use("/images/user", express.static("images/users"));
app.use("/", auth);
app.use("/", users);
app.use("/", recipes);
app.use("/", comments);
app.use("/", save);
app.use("/", like);

app.use("*", (req, res) => {
	res.send("test");
});

app.listen(port, () => {
	console.log("App is running...");
});
