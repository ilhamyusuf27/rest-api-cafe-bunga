const db = require("../db");

const getAllData = () => {
	return new Promise((resolve, reject) => {
		db.query("SELECT * FROM comments ORDER BY comment_id", (error, result) => {
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
		db.query("SELECT * FROM comments WHERE comment_id = $1", [comment_id], (error, result) => {
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
		db.query("INSERT INTO comments (recipe_id, user_id, comment) VALUES ($1,$2,$3)", [props.recipe_id, props.user_id, props.comment], (error, result) => {
			if (error) {
				reject(error);
			} else {
				resolve(result);
			}
		});
	});
};

const updateComment = (comment, comment_id) => {
	return new Promise((resolve, reject) => {
		db.query("UPDATE comments SET comment = $1 WHERE comment_id = $2", [comment, comment_id], (error, result) => {
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
		db.query("DELETE FROM comments WHERE comment_id = $1", [comment_id], (error, result) => {
			if (error) {
				reject(error);
			} else {
				resolve(result);
			}
		});
	});
};

const getCommentByRecipeId = (recipe_id) => {
	return new Promise((resolve, reject) => {
		db.query(
			`SELECT comments.*, users.name AS author, users.photo_profil AS avatar FROM comments LEFT JOIN users ON comments.user_id = users.user_id WHERE comments.recipe_id = $1 ORDER BY updated_at DESC`,
			[recipe_id],
			(error, result) => {
				if (error) {
					reject(error);
				} else {
					resolve(result);
				}
			}
		);
	});
};

module.exports = { getAllData, insertDataComment, getCommentById, getCommentByRecipeId, deleteComment, updateComment };
