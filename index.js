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

// const whitelist = ["http://localhost:3000"];

// const corsOption = function (req, callback) {
// 	let corsOptions;
// 	if (whitelist.indexOf(req.header("Origin")) !== -1) {
// 		corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
// 	} else {
// 		corsOptions = { origin: false }; // disable CORS for this request
// 	}
// 	callback(null, corsOptions); // callback expects two parameters: error and options
// };

// app.use(cors({ origins: "http://localhost:3000" }));
// const options = {
// 	origin: "http://localhost:3000",
// 	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
// 	preflightContinue: false,
// 	optionsSuccessStatus: 204,
// };
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/images/recipes", express.static("images/recipes"));
app.use("/images/user", express.static("images/users"));
app.use("/", users);
app.use("/", recipes);
app.use("/", comments);
app.use("/", login);
app.use("/", save);
app.use("/", like);

app.use("*", (req, res) => {
	res.send("sukses");
});

app.listen(port, () => {
	console.log("App is running...");
});
