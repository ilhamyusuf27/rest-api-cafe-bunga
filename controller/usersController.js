const model = require("../model/usersModel");
const bcrypt = require("bcrypt");
const cloudinary = require("../middleware/cloudinary");

const getDataUsers = async (req, res) => {
	try {
		const currentPage = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 5;
		const getData = await model.getAllData();
		const data = await model.getAllDataPagination({ currentPage, limit });
		if (data.rowCount > 0) {
			res.status(200).json({ total_data: getData.rowCount, result: data.rows, page: currentPage, limit });
		} else {
			res.status(404).json({ message: "Data users not found" });
		}
	} catch (error) {
		res.status(400).json({ message: "Program Error!!!" });
	}
};

const getDataById = async (req, res) => {
	try {
		const user_id = req.params.id;
		// console.log(user_id);
		const data = await model.getDataById(user_id);
		if (data.rowCount > 0) {
			res.status(200).json({ result: data.rows });
		} else {
			res.status(404).json({ message: `User with id-${user_id} not found!!!` });
		}
	} catch (error) {
		if (error.code === "22P02") {
			return res.status(406).json({ message: "User id must be a number" });
		}
		res.status(400).json({ message: "Program Error!!!" });
	}
};

const insertNewUser = async (req, res) => {
	try {
		const { name, phone_number, email, password, rePassword } = req.body;
		const photo_profil = req?.file?.path || null;
		const passwordValidation = password === rePassword;
		if (password.length < 8) {
			res.status(401).json({ message: "Password length must be more than 8 character" });
		} else {
			if (passwordValidation) {
				const salt = bcrypt.genSaltSync(15);
				const hash = bcrypt.hashSync(password, salt);
				const data = await model.insertDataUser({ name: name.trim(), phone_number: phone_number.trim(), email: email.trim(), password: hash, photo_profil });

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

const updateUser = async (req, res) => {
	try {
		const { user_id, name, phone_number, email } = req.body;
		const uploadImage = req?.file?.path ? await cloudinary.uploader.upload(req?.file?.path, { folder: "recipe" }) : undefined;
		const photo_profil = uploadImage?.secure_url;

		const checkData = await model.getDataById(user_id);
		if (checkData.rowCount > 0) {
			let inputName = name || checkData.rows[0]?.name;
			let inputPhoneNumber = phone_number || checkData.rows[0]?.phone_number;
			let inputEmail = email || checkData.rows[0]?.email;
			let inputPhoto = photo_profil || checkData.rows[0]?.photo_profil;
			const updateData = await model.updateDataUser({ name: inputName, phone_number: inputPhoneNumber, email: inputEmail, photo_profil: inputPhoto, user_id });
			if (updateData) {
				res.status(200).json({ message: `Data user dengan id-${user_id} berhasil di update` });
			} else {
				res.status(400).json({ message: `Data user dengan id-${user_id} gagal di update` });
			}
		} else {
			res.status(404).json({ message: `User dengan id-${user_id} tidak ditemukan` });
		}
	} catch (error) {
		res.status(400).json({ message: "Program Error!!!" });
	}
};

const updateImageUser = async (req, res) => {
	try {
		const { user_id } = req.body;
		const photo_profil = req?.file?.path;

		const checkData = await model.getDataById(user_id);
		if (checkData.rowCount > 0) {
			let inputPhoto = photo_profil || checkData.rows[0]?.photo_profil;
			const updateData = await model.updateImageUser({ photo_profil: inputPhoto, user_id });
			if (updateData) {
				res.status(200).json({ message: "Data images berhasil diubah" });
			} else {
				res.status(400).json({ message: "Data failed to change" });
			}
		} else {
			res.status(404).json({ message: `User dengan id-${user_id} tidak ditemukan` });
		}
	} catch (error) {
		res.status(400).json({ message: "Program Error!!!" });
	}
};

const deleteUser = async (req, res) => {
	try {
		const { user_id } = req.body;
		const getData = await model.getDataById(user_id);
		if (getData.rowCount > 0) {
			await model.deleteDataUser(user_id);
			res.status(200).json({ message: `User id:${user_id} berhasil dihapus` });
		} else {
			res.status(400).json({ message: "Data failed to delete" });
		}
	} catch (error) {
		res.status(400).json({ message: "Program Error!!!" });
	}
};

const userValidation = async (req, res, next) => {
	const { user_id } = req.body;
	const getData = await model.getDataById(user_id);
	if (!getData.rowCount) {
		return res.status(400).json({ message: "Users not found" });
	}
	const { role } = getData.rows[0];

	if (role === "user") {
		return res.status(400).json({ message: "Sorry, users are not allowed!" });
	}
	next();
};

module.exports = { getDataUsers, getDataById, updateUser, deleteUser, insertNewUser, updateImageUser, userValidation };
