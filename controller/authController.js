require("dotenv").config();
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const userModel = require("../model/usersModel");

const sendMail = require("../middleware/nodeMailer");

const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const getDataByEmail = await userModel.getDataByEmail(email);
		if (getDataByEmail.rowCount === 0) {
			res.status(404).json({ message: "Wrong email!" });
		} else {
			const { user_id, name, email: email_user, photo_profil, isverified } = getDataByEmail.rows[0];

			if (!isverified) {
				return res.status(401).json({ message: "Please verified your email first!" });
			}

			const checkPassword = bcrypt.compareSync(password, getDataByEmail.rows[0].password);
			if (checkPassword) {
				const accessToken = jwt.sign({ user_id, name, email_user }, process.env.SECRET_KEY, { expiresIn: "30m" });
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

const insertNewUser = async (req, res) => {
	try {
		const { name, phone_number, email, password, rePassword } = req.body;
		const passwordValidation = password === rePassword;
		if (password.length < 8) {
			res.status(401).json({ message: "Password length must be more than 8 character" });
		} else {
			if (passwordValidation) {
				const salt = bcrypt.genSaltSync(15);
				const hash = bcrypt.hashSync(password, salt);
				const email_token = crypto.randomBytes(65).toString("hex");

				const dataUser = {
					...req.body,
					email_token,
					host: req?.headers?.host,
				};

				const data = await userModel.insertDataUser({ name: name.trim(), phone_number: phone_number.trim(), email: email.trim(), password: hash, email_token });

				if (!data.rowCount) {
					return res.status(400).json({ message: "Failed create new account!" });
				}

				sendMail(dataUser)
					.then(() => {
						console.log("Verification email is sent to your email!!!");
					})
					.catch((err) => console.log(err));

				res.status(200).json({
					message: "Data added successfully",
					result: data.rows[0],
				});
			} else {
				res.status(401).json({ message: "Password and confirm password must be the same" });
			}
		}
	} catch (error) {
		if (error.code === "23505") {
			res.status(401).json({ message: "Email already exist" });
		} else {
			res.status(400).json({ message: "Program Error!!!" });
		}
	}
};

const verifiedEmail = async (req, res) => {
	const { token } = req.query;
	const getData = await userModel.findToken(token);

	if (!getData.rowCount) {
		return res.status(400).json({ message: "Token is invalid" });
	}

	const { user_id } = getData.rows[0];

	const data = { token: null, isverified: true, user_id };

	const updateData = await userModel.verifiedEmail(data);
	res.status(200).json({ message: "Email has been successfully verified!", result: updateData?.rows[0] });
};

const refreshToken = (req, res) => {
	try {
		const authHeader = req.headers?.authorization;
		if (authHeader === undefined) {
			return res.status(403).json({ message: "Please input token first" });
		}
		const token = authHeader.substring(7, authHeader.length);
		const decode = jwt.decode(token, { complete: true });
		const { user_id, name, email_user } = decode.payload;
		const newPayload = { user_id, name, email_user };

		const accessToken = jwt.sign(newPayload, process.env.SECRET_KEY, { expiresIn: "1d" });
		res.status(200).json({ token: accessToken });
	} catch (error) {
		res.status(400).json({ message: "Program error!!" });
	}
};

module.exports = { login, insertNewUser, verifiedEmail, refreshToken };
