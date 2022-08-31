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
			res.status(200).json({ total_data: getAllData.rowCount, result: getData.rows, page: currentPage, limit });
		} else {
			res.status(404).json({ message: "Data recipes not found!!!!" });
		}
	} catch (error) {
		res.status(400).json({ message: "Program error!!!" });
	}
};

const getDataWithComment = async (req, res) => {
	try {
		const getData = await model.getDataWithComment();
		if (getData.rowCount > 0) {
			res.status(200).json({ result: getData.rows });
		} else {
			res.status(404).json({ message: "Data recipe with comment not found!!!!" });
		}
	} catch (error) {
		console.log(error);
		res.status(400).json({ message: "Program error!!!" });
	}
};

const getRecipeByUserId = async (req, res) => {
	try {
		const { user_id } = req.body;
		const getData = await model.getRecipeByUserId(user_id);
		if (getData.rowCount > 0) {
			res.status(200).json({ result: getData.rows });
		} else {
			res.status(404).json({ message: `User with id-${user_id} doesn't have recipes!!!` });
		}
	} catch (error) {
		res.status(400).json({ message: "Program Error!!!" });
	}
};

const getRecipeById = async (req, res) => {
	try {
		const { recipe_id } = req.body;
		const getData = await model.getRecipeById(recipe_id);
		if (getData.rowCount > 0) {
			res.status(200).json({ result: getData.rows });
		} else {
			res.status(404).json({ message: `Recipe with id-${recipe_id} not found!!!` });
		}
	} catch (error) {
		if (error.code === "22P02") {
			return res.status(400).json({ message: "Recipe id must be a number" });
		}
		res.status(400).json({ message: "Program Error!!!" });
	}
};

const getRecipeByIdParams = async (req, res) => {
	try {
		const { id } = req.params;
		const getData = await model.getDataPerPageWithoutPage(id);
		if (getData.rowCount > 0) {
			res.send({ result: getData.rows });
		} else {
			res.status(404).json({ message: `Recipe with id-${id} not found!!!` });
		}
	} catch (error) {
		if (error.code === "22P02") {
			return res.status(400).json({ message: "Params must be a number" });
		}
		res.status(400).json({ message: "Program Error!!!" });
	}
};

const insertNewRecipe = async (req, res) => {
	try {
		const { user_id, title, ingredients, video_link } = req.body;
		const uploadImage = await cloudinary.uploader.upload(req.file.path, { folder: "recipe" });
		const recipe_images = uploadImage.secure_url;
		const getDataById = await userModel.getDataById(user_id);
		if (getDataById.rowCount === 0) {
			res.status(404).json({ message: `User id-${user_id} not found` });
		} else {
			if (ingredients.length > 255) {
				res.status(400).json({ message: "exceed the maximum capacity, ingredients must be less than 255 characters" });
			} else {
				const data = await model.insertDataRecipe({ user_id, title, ingredients, recipe_images, video_link });
				if (data) {
					res.status(200).json({ message: "Recipe berhasil ditambah", result: data.rows[0] });
				} else {
					res.status(400).json({ message: `Data failed to add` });
				}
			}
		}
	} catch (error) {
		res.status(400).json({ message: "Program Error!!!" });
	}
};

const recipeTrending = async (req, res) => {
	try {
		const getDataTrending = await model.getRecipeTrending();
		if (getDataTrending.rowCount > 0) {
			res.status(200).json({
				totel_data: getDataTrending.rowCount,
				result: getDataTrending.rows,
			});
		} else {
			res.status(404).json({ message: "Trending recipes not found" });
		}
	} catch (error) {
		res.status(400).json({ message: "Program Error!!!" });
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
			res.status(404).json({ message: `Resep dengan judul ${title} tidak ditemukan` });
		}
	} catch (error) {
		res.status(400).json({ message: "Program error!!!" });
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
				res.status(200).json({ message: "Data berhasil diubah" });
			} else {
				res.status(400).json({ message: "Data failed to change" });
			}
		} else {
			res.status(404).json({ message: `Recipe with id-${recipe_id} not found` });
		}
	} catch (error) {
		res.status(400).json({ message: "Program Error!!!" });
	}
};

const deleteDataRecipe = async (req, res) => {
	try {
		const { id } = req.params;
		const getData = await model.getDataById(id);
		if (getData.rowCount > 0) {
			await model.deleteRecipe(id);
			res.status(200).json({ message: `Recipe: ${getData.rows[0].title} berhasil dihapus` });
		} else {
			res.status(400).json({ message: `Recipe failed to delete` });
		}
	} catch (error) {
		res.status(400).json({ message: "Program Error!!!" });
	}
};

const getAllDataWithoutPagination = async (req, res) => {
	try {
		const getData = await model.getAllData();
		if (getData.rowCount > 0) {
			res.status(200).json({ total_data: getData.rowCount, result: getData.rows });
		} else {
			res.status(404).json({ message: "Data not found!!!!" });
		}
	} catch (error) {
		res.status(400).json({ message: "Program Error!!!" });
	}
};

const getDataPopular = async (req, res) => {
	try {
		const getData = await model.getDataPopular();
		if (getData.rowCount > 0) {
			res.send({ total_data: getData.rowCount, result: getData.rows });
		} else {
			res.status(404).json({ message: "Recipe popular not found!!!!" });
		}
	} catch (error) {
		res.status(400).json({ message: "Program Error!!!" });
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
