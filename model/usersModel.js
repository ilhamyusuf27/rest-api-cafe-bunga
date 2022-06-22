const db = require('../db');

const getAllData = () => {
	return new Promise((resolve, reject) => {
		db.query('SELECT * FROM users', (error, result) => {
			if (error) {
				reject(error);
			} else {
				resolve(result);
			}
		});
	});
};

const getAllDataPagination = (params) => {
	return new Promise((resolve, reject) => {
		db.query('SELECT * FROM users LIMIT $2 OFFSET (($1 -1) * $2)', [params.currentPage, params.limit], (error, result) => {
			if (error) {
				reject(error);
			} else {
				resolve(result);
			}
		});
	});
};

const getDataById = (id) => {
	return new Promise((resolve, reject) => {
		db.query('SELECT * FROM users WHERE user_id = $1', [id], (error, result) => {
			if (error) {
				reject(error);
			} else {
				resolve(result);
			}
		});
	});
};

const insertDataUser = (props) => {
	return new Promise((resolve, reject) => {
		db.query(
			'INSERT INTO users (name, phone_number, email, password, photo_profil) VALUES ($1, $2, $3, $4, $5)',
			[props.name, props.phone_number, props.email, props.password, props.photo_profil],
			(error, result) => {
				if (error) {
					reject(error);
				} else {
					resolve(result);
				}
			},
		);
	});
};

const updateDataUser = (props) => {
	return new Promise((resolve, reject) => {
		db.query(
			'UPDATE users SET name = $1, phone_number = $2, email = $3, password = $4 WHERE user_id = $5',
			[props.name, props.phone_number, props.email, props.password, props.user_id],
			(error, result) => {
				if (error) {
					reject(error);
				} else {
					resolve(result);
				}
			},
		);
	});
};

const deleteDataUser = (user_id) => {
	return new Promise((resolve, reject) => {
		db.query('DELETE FROM users WHERE user_id = $1', [user_id], (error, result) => {
			if (error) {
				reject(error);
			} else {
				resolve(result);
			}
		});
	});
};

module.exports = { getAllData, getDataById, insertDataUser, updateDataUser, deleteDataUser, getAllDataPagination };
