const model = require("../model/recipeModel");

const saveRecipe = async (req, res) => {
	try {
		const { recipe_id, user_id } = req.body;
		const getDataRecipe = await model.getDataPerPageWithoutPage(recipe_id);
		if (!getDataRecipe.rowCount) {
			return res.status(404).send("Data not found");
		}
		const likedData = getDataRecipe?.rows[0]?.save;

		if (!likedData) {
			await model.saveIsEmpty(user_id, recipe_id);
			const getData = await model.getAllData();
			return res.send({ message: "Data berhasil di simpan", result: getData.rows });
		}

		if (likedData.includes(user_id)) {
			return res.status(400).send({ message: "Data sudah tersimpan" });
		}

		if (likedData) {
			console.log(likedData.includes(parseInt(user_id)));
			const updateSave = likedData;
			updateSave.push(user_id);
			const joinSave = `{${updateSave.join(",")}}`;
			await model.editSave(joinSave, recipe_id);
			const getData = await model.getAllData();
			return res.status(200).send({ message: "Data berhasil di simpan", result: getData.rows });
		}
	} catch (error) {
		console.log(error);
		res.status(400).send("Program error!!!");
	}
};

const unSaveRecipe = async (req, res) => {
	try {
		const { recipe_id, user_id } = req.body;
		const getDataRecipe = await model.getDataPerPageWithoutPage(recipe_id);
		if (!getDataRecipe.rowCount) {
			return res.status(404).send("Data not found");
		}
		const likedData = getDataRecipe?.rows[0]?.save;

		if (likedData.includes(user_id.toString())) {
			const unSave = likedData.splice(user_id, 1);
			const joinSave = `{${unSave.join(",")}}`;
			await model.editSave(joinSave, recipe_id);
			const getData = await model.getAllData();
			return res.status(200).send({ message: "Recipe sudah tidak tersimpan", result: getData.rows });
		} else {
			return res.status(400).send("Data tidak ditemukan");
		}
	} catch (error) {
		res.status(400).send("Program error!!!");
	}
};

const saveRecipeDetail = async (req, res) => {
	try {
		const { recipe_id, user_id } = req.body;
		const getDataRecipe = await model.getDataPerPageWithoutPage(recipe_id);
		if (!getDataRecipe.rowCount) {
			return res.status(404).send("Data not found");
		}
		const likedData = getDataRecipe?.rows[0]?.save;

		if (!likedData) {
			await model.saveIsEmpty(user_id, recipe_id);
			const getData = await model.getAllData();
			return res.send({ message: "Data berhasil di simpan", result: getData.rows });
		}

		if (likedData.includes(user_id)) {
			return res.status(400).send({ message: "Data sudah tersimpan" });
		}

		if (likedData) {
			// console.log(likedData.includes(user_id));
			const updateSave = likedData;
			updateSave.push(user_id);
			const joinSave = `{${updateSave.join(",")}}`;
			await model.editSave(joinSave, recipe_id);
			const getData = await model.getDataPerPageWithoutPage(recipe_id.toString());
			return res.status(200).send({ message: "Data berhasil di simpan", result: getData.rows });
		}
	} catch (error) {
		console.log(error);
		res.status(400).send("Program error!!!");
	}
};

const unSaveRecipeDetail = async (req, res) => {
	try {
		const { recipe_id, user_id } = req.body;
		const getDataRecipe = await model.getDataById(recipe_id);
		if (!getDataRecipe.rowCount) {
			return res.status(404).send("Data not found");
		}
		const likedData = getDataRecipe?.rows[0]?.save;

		if (likedData.includes(user_id.toString())) {
			const unSave = likedData.splice(user_id, 1);
			const joinSave = `{${unSave.join(",")}}`;
			await model.editSave(joinSave, recipe_id);
			const getData = await model.getDataById(recipe_id.toString());
			return res.status(200).send({ message: "Recipe sudah tidak tersimpan", result: getData.rows });
		} else {
			return res.status(400).send("Data tidak ditemukan");
		}
	} catch (error) {
		res.status(400).send("Program error!!!");
	}
};

const getDataSave = async (req, res) => {
	try {
		const { id } = req.params;
		const getData = await model.getDataBySave(id.toString());
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
	saveRecipe,
	unSaveRecipe,
	getDataSave,
	saveRecipeDetail,
	unSaveRecipeDetail,
};
