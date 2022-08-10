const model = require("../model/recipeModel");
const userModel = require("../model/usersModel");
const cloudinary = require("../middleware/cloudinary");

const getAllDataRecipe = async (req, res) => {
	try {
		const currentPage = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 5;
		const getAllData = await model.getAllData();
		const getData = await model.getDataPerPage({ currentPage, limit });
		if (getData.rowCount > 0) {
			res.send({ total_data: getAllData.rowCount, result: getData.rows, page: currentPage, limit });
		} else {
			res.status(404).send("Data not found!!!!");
		}
	} catch (error) {
		res.status(400).send("Program error!!!");
	}
};

const getDataWithComment = async (req, res) => {
	try {
		const getData = await model.getDataWithComment();
		if (getData.rowCount > 0) {
			res.send({ result: getData.rows });
		} else {
			res.status(404).send("Data not found!!!!");
		}
	} catch (error) {
		res.status(400).send("Program error!!!");
	}
};

const getRecipeByUserId = async (req, res) => {
	try {
		const { user_id } = req.body;
		const getData = await model.getRecipeByUserId(user_id);
		if (getData.rowCount > 0) {
			res.send({ result: getData.rows });
		} else {
			res.status(404).send("Data not found!!!");
		}
	} catch (error) {
		res.status(400).send("Program Error!!!");
	}
};

const getRecipeById = async (req, res) => {
	try {
		const { recipe_id } = req.body;
		const getData = await model.getRecipeById(recipe_id);
		if (getData.rowCount > 0) {
			res.send({ result: getData.rows });
		} else {
			res.status(404).send("Data not found!!!");
		}
	} catch (error) {
		res.status(400).send("Program Error!!!");
	}
};

const getRecipeByIdParams = async (req, res) => {
	try {
		const { id } = req.params;
		const getData = await model.getDataPerPageWithoutPage(id);
		if (getData.rowCount > 0) {
			res.send({ result: getData.rows });
		} else {
			res.status(404).send("Data not found!!!");
		}
	} catch (error) {
		console.log("params", error);
		res.status(400).send("Program Error!!!");
	}
};

const insertNewRecipe = async (req, res) => {
	try {
		const { user_id, title, ingredients, video_link } = req.body;
		const uploadImage = await cloudinary.uploader.upload(req.file.path, { folder: "recipe" });
		// console.log(uploadImage)
		const recipe_images = uploadImage.secure_url;
		const getDataById = await userModel.getDataById(user_id);
		if (getDataById.rowCount === 0) {
			// await unlinkAsync(req.file.path);
			res.status(404).send("User id not found");
		} else {
			if (ingredients.length > 255) {
				// await unlinkAsync(req.file.path);
				res.status(400).send("exceed the maximum capacity, ingredients must be less than 255 characters");
			} else {
				const data = await model.insertDataRecipe({ user_id, title, ingredients, recipe_images, video_link });
				if (data) {
					res.send("Data berhasil ditambah");
				} else {
					// await unlinkAsync(req.file.path);
					res.status(400).send("Data failed to add");
				}
			}
		}
	} catch (error) {
		console.log(error);
		res.status(400).send(error.message);
	}
};

const recipeTrending = async (req, res) => {
	try {
		const getDataTrending = await model.getRecipeTrending();
		if (getDataTrending.rowCount > 0) {
			res.send({
				totel_data: getDataTrending.rowCount,
				result: getDataTrending.rows,
			});
		} else {
			res.status(404).send("Data not found");
		}
	} catch (error) {
		console.log(error);
		console.log("test");
		// res.status(400).send("Program error");
	}
};

const getDataByTitle = async (req, res) => {
	try {
		const { title } = req.params;
		const tambah = `%${title.toLowerCase()}%`;
		const getData = await model.getDataByName(tambah);
		if (getData.rowCount > 0) {
			res.send(getData.rows);
		} else {
			res.status(404).send("Resep tidak ditemukan");
		}
	} catch (error) {
		console.log(error);
		res.status(400).send("Program error!!!");
	}
};

const updateRecipe = async (req, res) => {
	try {
		const { recipe_id, title, ingredients, video_link } = req.body;
		const recipe_images = req?.file?.path;

		const checkData = await model.getDataById(recipe_id);
		if (checkData.rowCount > 0) {
			let inputTitle = title || checkData.rows[0]?.title;
			let inputIngredients = ingredients || checkData.rows[0]?.ingredients;
			let inputImages = recipe_images || checkData.rows[0]?.recipe_images;
			let inputVideoLink = video_link || checkData.rows[0]?.video_link;
			const updateData = await model.updateDataRecipe({ title: inputTitle, ingredients: inputIngredients, recipe_images: inputImages, video_link: inputVideoLink, recipe_id });
			if (updateData) {
				res.send("Data berhasil diubah");
			} else {
				res.status(400).send("Data failed to change");
			}
		} else {
			res.status(404).send("Data not found");
		}
	} catch (error) {
		res.status(400).send("Program error!!!");
	}
};

const deleteDataRecipe = async (req, res) => {
	try {
		const { recipe_id } = req.body;
		const getData = await model.getDataById(recipe_id);
		if (getData.rowCount > 0) {
			await model.deleteRecipe(recipe_id);
			res.send(`Recipe: ${getData.rows[0].title} berhasil dihapus`);
		} else {
			res.status(400).send("Recipe failed to delete");
		}
	} catch (error) {
		res.status(400).send("Program error!!!");
	}
};

const getAllDataWithoutPagination = async (req, res) => {
	try {
		const getData = await model.getAllData();
		if (getData.rowCount > 0) {
			res.send({ total_data: getData.rowCount, result: getData.rows });
		} else {
			res.status(404).send("Data not found!!!!");
		}
	} catch (error) {
		res.status(400).send("Program error!!!");
	}
};

const getDataPopular = async (req, res) => {
	try {
		const getData = await model.getDataPopular();
		if (getData.rowCount > 0) {
			res.send({ total_data: getData.rowCount, result: getData.rows });
		} else {
			res.status(404).send("Data not found!!!!");
		}
	} catch (error) {
		res.status(400).send("Program error!!!");
	}
};

module.exports = {
	getAllDataRecipe,
	insertNewRecipe,
	recipeTrending,
	getDataByTitle,
	getDataWithComment,
	updateRecipe,
	deleteDataRecipe,
	getRecipeByUserId,
	getRecipeById,
	getAllDataWithoutPagination,
	getRecipeByIdParams,
	getDataPopular,
};
