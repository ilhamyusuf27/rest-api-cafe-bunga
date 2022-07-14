const model = require('../model/usersModel');
const bcrypt = require('bcrypt');
const fs = require('fs');
const { promisify } = require('util');

const unlinkAsync = promisify(fs.unlink);

// const Cryptojs = require('crypto-js');
// const { mode } = require('crypto-js');

const getDataUsers = async (req, res) => {
	try {
		const currentPage = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 5;
		const getData = await model.getAllData();
		const data = await model.getAllDataPagination({ currentPage, limit });
		if (data.rowCount > 0) {
			res.send({ total_data: getData.rowCount, result: data.rows, page: currentPage, limit });
		} else {
			res.status(404).send('Data not found');
		}
	} catch (error) {
		res.status(400).send('Program error!');
	}
};

const getDataById = async (req, res) => {
	try {
		const user_id = req.params.id;
		// console.log(user_id);
		const data = await model.getDataById(user_id);
		if (data.rowCount > 0) {
			res.send({ result: data.rows });
		} else {
			res.status(404).send('Data not found');
		}
	} catch (error) {
		res.status(400).send('Program error!');
	}
};

const insertNewUser = async (req, res) => {
	try {
		const { name, phone_number, email, password, rePassword } = req.body;
		const photo_profil = req?.file?.path || 'images/users/default.jpg';
		const passwordValidation = password === rePassword;
		console.log(req.body);
		if (password.length < 8) {
			// await unlinkAsync(req.file.path);
			res.status(401).send('Password length must be more than 8 character');
		} else {
			if (passwordValidation) {
				const salt = bcrypt.genSaltSync(15);
				const hash = bcrypt.hashSync(password, salt);
				await model.insertDataUser({ name: name.trim(), phone_number: phone_number.trim(), email: email.trim(), password: hash, photo_profil });
				const getDataByEmail = await model.getDataByEmail(email);
				res.send({
					message: 'Data added successfully',
					result: getDataByEmail.rows[0],
				});
			} else {
				// await unlinkAsync(req.file.path);
				res.status(401).send('Password invalid');
			}
		}
	} catch (error) {
		if (error.constraint === 'uc_email') {
			// await unlinkAsync(req.file.path);
			res.status(401).send('Email already exist');
		} else {
			// await unlinkAsync(req.file.path);
			console.log(error);
			res.send('error');
		}
	}
};

const updateUser = async (req, res) => {
	try {
		const { user_id, name, phone_number, email } = req.body;
		const photo_profil = req?.file?.path;

		const checkData = await model.getDataById(user_id);
		if (checkData.rowCount > 0) {
			let inputName = name || checkData.rows[0]?.name;
			let inputPhoneNumber = phone_number || checkData.rows[0]?.phone_number;
			let inputEmail = email || checkData.rows[0]?.email;
			let inputPhoto = photo_profil || checkData.rows[0]?.photo_profil;
			const updateData = await model.updateDataUser({ name: inputName, phone_number: inputPhoneNumber, email: inputEmail, photo_profil: inputPhoto, user_id });
			if (updateData) {
				res.send('Data berhasil diubah');
			} else {
				res.status(400).send('Data failed to change');
			}
		} else {
			res.status(404).send('Data not found');
		}
	} catch (error) {
		console.log(error);
		res.status(400).send('Program error!');
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
				res.send('Data berhasil diubah');
			} else {
				res.status(400).send('Data failed to change');
			}
		} else {
			res.status(404).send('Data not found');
		}
	} catch (error) {
		console.log(error);
		res.status(400).send('Program error!');
	}
};

const deleteUser = async (req, res) => {
	try {
		const { user_id } = req.body;
		const getData = await model.getDataById(user_id);
		if (getData.rowCount > 0) {
			const deleteData = await model.deleteDataUser(user_id);
			res.send(`User id:${user_id} berhasil dihapus`);
		} else {
			res.status(400).send('Data failed to delete');
		}
	} catch (error) {
		console.log(error);
		res.status(400).send('Program error!');
	}
};

module.exports = { getDataUsers, getDataById, updateUser, deleteUser, insertNewUser, updateImageUser };
