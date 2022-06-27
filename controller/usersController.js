const model = require('../model/usersModel');
const Cryptojs = require('crypto-js');
const { mode } = require('crypto-js');

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
		const { id } = req.body;
		const data = await model.getDataById(id);
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
		if (password.length < 8) {
			res.send('Password length must be more than 8 character');
		} else {
			if (passwordValidation) {
				const encryptPass = Cryptojs.AES.encrypt(password, 'secret key 123').toString();
				const data = await model.insertDataUser({ name, phone_number, email, password: encryptPass, photo_profil });
				res.send({
					message: 'Data added successfully',
				});
			} else {
				res.status(401).send('Password invalid');
			}
		}
	} catch (error) {
		if (error.constraint === 'uc_email') {
			res.status(401).send('Email already exist');
		}
		res.send('error');
	}
};

const addUser = (req, res) => {
	try {
		const { name } = req.body;
		console.log(name);
		res.send(name);
	} catch (error) {
		res.send(error);
	}
};

const updateUser = async (req, res) => {
	try {
		const { user_id, name, phone_number, email } = req.body;
		let { password } = req.body;
		password = Cryptojs.AES.encrypt(password, 'secret key 123').toString();
		const checkData = await model.getDataById(user_id);
		if (checkData.rowCount > 0) {
			let inputName = name || checkData.rows[0]?.name;
			let inputPhoneNumber = phone_number || checkData.rows[0]?.phone_number;
			let inputEmail = email || checkData.rows[0]?.email;
			let inputPassword = password || checkData.rows[0]?.password;
			const updateData = await model.updateDataUser({ name: inputName, phone_number: inputPhoneNumber, email: inputEmail, password: inputPassword, user_id });
			if (updateData) {
				res.send('Data berhasil diubah');
			} else {
				res.status(400).send('Data failed to change');
			}
		} else {
			res.status(404).send('Data not found');
		}
	} catch (error) {
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

module.exports = { getDataUsers, getDataById, updateUser, deleteUser, addUser, insertNewUser };
