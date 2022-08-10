const model = require("../model/recipeModel");
// Liked
const likedRecipe = async (req, res) => {
	try {
		const { recipe_id, user_id } = req.body;
		const getDataRecipe = await model.getDataPerPageWithoutPage(recipe_id);
		if (!getDataRecipe.rowCount) {
			return res.status(404).send("Data not found");
		}
		const likedData = getDataRecipe?.rows[0]?.likes;

		if (!likedData) {
			await model.likeIsEmpty(user_id, recipe_id);
			const getData = await model.getAllData();
			return res.send({ message: "Data berhasil di sukai", result: getData.rows });
		}

		if (likedData.includes(user_id)) {
			return res.status(400).send({ message: "Data sudah disukai" });
		}

		if (likedData) {
			const updateSave = likedData;
			updateSave.push(user_id);
			const joinSave = `{${updateSave.join(",")}}`;
			await model.editLike(joinSave, recipe_id);
			const getData = await model.getAllData();
			return res.status(200).send({ message: "Data berhasil di sukai", result: getData.rows });
		}
	} catch (error) {
		console.log(error);
		res.status(400).send("Program error!!!");
	}
};

const unLikedRecipe = async (req, res) => {
	try {
		const { recipe_id, user_id } = req.body;
		const getDataRecipe = await model.getDataPerPageWithoutPage(recipe_id);
		if (!getDataRecipe.rowCount) {
			return res.status(404).send("Data not found");
		}
		const likedData = getDataRecipe?.rows[0]?.likes;

		if (likedData.includes(user_id.toString())) {
			const unSave = likedData.splice(user_id, 1);
			const joinSave = `{${unSave.join(",")}}`;
			await model.editLike(joinSave, recipe_id);
			const getData = await model.getAllData();
			return res.status(200).send({ message: "Recipe sudah tidak disukai", result: getData.rows });
		} else {
			return res.status(400).send("Data tidak ditemukan");
		}
	} catch (error) {
		res.status(400).send("Program error!!!");
	}
};

const likedRecipeDetail = async (req, res) => {
	try {
		const { recipe_id, user_id } = req.body;
		const getDataRecipe = await model.getDataPerPageWithoutPage(recipe_id);
		if (!getDataRecipe.rowCount) {
			return res.status(404).send("Data not found");
		}
		const likedData = getDataRecipe?.rows[0]?.likes;

		if (!likedData) {
			await model.likeIsEmpty(user_id, recipe_id);
			const getData = await model.getAllData();
			return res.send({ message: "Data berhasil di sukai", result: getData.rows });
		}

		if (likedData.includes(user_id)) {
			return res.status(400).send({ message: "Data sudah disukai" });
		}

		if (likedData) {
			const updateSave = likedData;
			updateSave.push(user_id);
			const joinSave = `{${updateSave.join(",")}}`;
			await model.editLike(joinSave, recipe_id);
			const getData = await model.getDataById(recipe_id.toString());
			return res.status(200).send({ message: "Data berhasil di sukai", result: getData.rows });
		}
	} catch (error) {
		console.log(error);
		res.status(400).send("Program error!!!");
	}
};

const unLikedRecipeDetail = async (req, res) => {
	try {
		const { recipe_id, user_id } = req.body;
		const getDataRecipe = await model.getDataPerPageWithoutPage(recipe_id);
		if (!getDataRecipe.rowCount) {
			return res.status(404).send("Data not found");
		}
		const likedData = getDataRecipe?.rows[0]?.likes;

		if (likedData.includes(user_id.toString())) {
			const unSave = likedData.splice(user_id, 1);
			const joinSave = `{${unSave.join(",")}}`;
			await model.editLike(joinSave, recipe_id);
			const getData = await model.getDataById(recipe_id.toString());
			return res.status(200).send({ message: "Recipe sudah tidak disukai", result: getData.rows });
		} else {
			return res.status(400).send("Data tidak ditemukan");
		}
	} catch (error) {
		res.status(400).send("Program error!!!");
	}
};

const getDataLiked = async (req, res) => {
	try {
		const { id } = req.params;
		const getData = await model.getDataByLiked(id.toString());
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
	likedRecipe,
	unLikedRecipe,
	getDataLiked,
	likedRecipeDetail,
	unLikedRecipeDetail,
};
