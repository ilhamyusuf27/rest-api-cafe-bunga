require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../model/usersModel");

const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const getDataByEmail = await userModel.getDataByEmail(email);
		if (getDataByEmail.rowCount === 0) {
			res.status(404).json({ message: "Wrong email!" });
		} else {
			const { user_id, name, email: email_user, photo_profil } = getDataByEmail.rows[0];
			const checkPassword = bcrypt.compareSync(password, getDataByEmail.rows[0].password);
			if (checkPassword) {
				const accessToken = jwt.sign({ user_id, name, email_user }, process.env.SECRET_KEY, { expiresIn: "1d" });
				res.status(200).json({
					message: "Login successfully",
					token: accessToken,
					data: {
						user_id,
						name,
						email_user,
						photo_profil,
					},
				});
			} else {
				res.status(403).json({ message: "Wrong password!" });
			}
		}
	} catch (error) {
		res.status(400).json({ message: "Program error!!!" });
	}
};

module.exports = { login };
