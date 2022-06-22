const db = require('../db');

const getAllData = () => {
	return new Promise((resolve, reject) => {
		db.query('SELECT * FROM comments ORDER BY comment_id', (error, result) => {
			if (error) {
				reject(error);
			} else {
				resolve(result);
			}
		});
	});
};

const getCommentById = (comment_id) => {
	return new Promise((resolve, reject) => {
		db.query('SELECT * FROM comments WHERE comment_id = $1', [comment_id], (error, result) => {
			if (error) {
				reject(error);
			} else {
				resolve(result);
			}
		});
	});
};

const getCommentByRecipeId = (id) => {
	return new Promise((resolve, reject) => {
		db.query('SELECT * FROM comments WHERE recipe_id = $1', [id], (error, result) => {
			if (error) {
				reject(error);
			} else {
				resolve(result);
			}
		});
	});
};

const insertDataComment = (props) => {
	return new Promise((resolve, reject) => {
		db.query('INSERT INTO comments (recipe_id, content) VALUES ($1,$2)', [props.recipe_id, props.content], (error, result) => {
			if (error) {
				reject(error);
			} else {
				resolve(result);
			}
		});
	});
};

const updateComment = (value, comment_id) => {
	return new Promise((resolve, reject) => {
		db.query('UPDATE comments SET content = $1 WHERE comment_id = $2', [value, comment_id], (error, result) => {
			if (error) {
				reject(error);
			} else {
				resolve(result);
			}
		});
	});
};

const deleteComment = (comment_id) => {
	return new Promise((resolve, reject) => {
		db.query('DELETE FROM comments WHERE comment_id = $1', [comment_id], (error, result) => {
			if (error) {
				reject(error);
			} else {
				resolve(result);
			}
		});
	});
};

module.exports = { getAllData, insertDataComment, getCommentById, getCommentByRecipeId, deleteComment, updateComment };
