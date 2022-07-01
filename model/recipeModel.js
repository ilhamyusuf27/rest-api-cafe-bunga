const db = require('../db');

const getAllData = () => {
	return new Promise((resolve, reject) => {
		db.query('SELECT * FROM recipe', (error, result) => {
			if (error) {
				reject(error);
			} else {
				resolve(result);
			}
		});
	});
};

const getDataPerPage = (params) => {
	return new Promise((resolve, reject) => {
		db.query(
			'SELECT recipe.*, users.name AS author FROM recipe LEFT JOIN users ON recipe.user_id = users.user_id ORDER BY recipe_id ASC LIMIT $2 OFFSET (($1 -1) * $2)',
			[params.currentPage, params.limit],
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

const getDataWithComment = () => {
	return new Promise((resolve, reject) => {
		db.query(
			'SELECT recipe.recipe_id, recipe.title, recipe.ingredients, comments.comment_id ,comments.recipe_id, comments.content FROM recipe INNER JOIN comments ON recipe.recipe_id = comments.recipe_id ORDER BY recipe.recipe_id',
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

const insertDataRecipe = (props) => {
	return new Promise((resolve, reject) => {
		db.query(
			'INSERT INTO recipe (user_id, title, ingredients, recipe_images, video_link ) VALUES ($1, $2, $3, $4, $5)',
			[props.user_id, props.title, props.ingredients, props.recipe_images, props.video_link],
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

const getDataByName = (title) => {
	return new Promise((resolve, reject) => {
		db.query('SELECT * FROM recipe WHERE title LIKE $1', [title], (error, result) => {
			if (error) {
				reject(error);
			} else {
				resolve(result);
			}
		});
	});
};

const getDataById = (user_id) => {
	return new Promise((resolve, reject) => {
		db.query('SELECT * FROM recipe WHERE recipe_id = $1', [user_id], (error, result) => {
			if (error) {
				reject(error);
			} else {
				resolve(result);
			}
		});
	});
};

const getRecipeTrending = () => {
	return new Promise((resolve, reject) => {
		db.query('SELECT * FROM recipe ORDER BY recipe_id DESC LIMIT 5', (error, result) => {
			if (error) {
				reject(error);
			} else {
				resolve(result);
			}
		});
	});
};

const updateDataRecipe = (props) => {
	return new Promise((resolve, reject) => {
		db.query(
			'UPDATE recipe SET title = $1, ingredients = $2, recipe_images = $3, video_link = $4 WHERE recipe_id = $5',
			[props.title, props.ingredients, props.recipe_images, props.video_link, props.recipe_id],
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

const deleteRecipe = (recipe_id) => {
	return new Promise((resolve, reject) => {
		db.query('DELETE FROM recipe WHERE recipe_id = $1', [recipe_id], (error, result) => {
			if (error) {
				reject(error);
			} else {
				resolve(result);
			}
		});
	});
};

module.exports = { getAllData, getDataPerPage, insertDataRecipe, getRecipeTrending, getDataByName, getDataWithComment, getDataById, updateDataRecipe, deleteRecipe };
