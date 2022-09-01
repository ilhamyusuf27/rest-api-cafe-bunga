require("dotenv").config();
const jwt = require("jsonwebtoken");

const authenticationToken = (req, res, next) => {
	try {
		const authHeader = req.headers?.authorization;
		if (authHeader === undefined) {
			res.status(403).send("Please input token first");
		} else {
			const token = authHeader.substring(7, authHeader.length);
			const decoded = jwt.verify(token, process.env.SECRET_KEY);
			if (decoded) {
				next();
			}
		}
	} catch (error) {
		if (error.message === "jwt expired") {
			return next();
		}
		res.status(400).send(error.message);
	}
};

module.exports = { authenticationToken };
