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
const login = require("./routes/loginRoutes");
const save = require("./routes/saveRoutes");
const like = require("./routes/likeRoutes");

app.use(helmet({ crossOriginResourcePolicy: false }));

const whitelist = ["http://localhost:3000"];

const corsOption = {
	origin: function (origin, callback) {
		if (whitelist.indexOf(origin) !== -1) {
			callback(null, true);
		} else {
			callback(new Error("Not allowaned by CORS"));
		}
	},
};

// app.use(cors({ origins: "http://localhost:3000" }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/images/recipes", express.static("images/recipes"));
app.use("/images/user", express.static("images/users"));
app.use("/", cors(corsOption), users);
app.use("/", cors(corsOption), recipes);
app.use("/", cors(corsOption), comments);
app.use("/", cors(corsOption), login);
app.use("/", cors(corsOption), save);
app.use("/", cors(corsOption), like);

app.use("*", (req, res) => {
	res.send("sukses");
});

app.listen(port, () => {
	console.log("App is running...");
});
