const model = require("../model/commentModel");

const showAllComment = async (req, res) => {
	try {
		const getData = await model.getAllData();
		if (getData.rowCount > 0) {
			res.send(getData.rows);
		} else {
			res.status(404).send("Data not found");
		}
	} catch (error) {
		res.status(400).send("Program error!!!");
	}
};

const insertComment = async (req, res) => {
	try {
		const { comment, user_id } = req.body;
		const recipe_id = req.params.id;
		const insertData = await model.insertDataComment({ recipe_id, comment, user_id });
		if (insertData) {
			const getData = await model.getCommentByRecipeId(recipe_id);
			res.send({ message: "Data added successfully", result: getData.rows });
		} else {
			res.status("400").send("Data failed to change");
		}
	} catch (error) {
		console.log(error);
		res.status(400).send("Program error!!!");
	}
};

const updateComment = async (req, res) => {
	try {
		const { comment_id, comment } = req.body;
		const checkData = await model.getCommentById(comment_id);
		if (checkData.rowCount > 0) {
			let inputComment = comment || checkData.rows[0]?.comment;
			const updateData = await model.updateComment(inputComment, comment_id);
			if (updateData) {
				res.send("Data has been change successfully");
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

const deleteComment = async (req, res) => {
	try {
		const { comment_id } = req.body;
		const getData = await model.getCommentById(comment_id);
		if (getData.rowCount > 0) {
			await model.deleteComment(comment_id);
			res.send(`Comment deleted successfully`);
		} else {
			res.status(400).send("Comment failed to delete");
		}
	} catch (error) {
		res.status(400).send("Program error!!!");
	}
};

const getDataByRecipeId = async (req, res) => {
	try {
		const { id } = req.params;
		const getData = await model.getCommentByRecipeId(id);
		if (getData.rowCount > 0) {
			res.send({
				totalData: getData.rowCount,
				result: getData.rows,
			});
		} else {
			res.status(404).send({ message: "Comment not found" });
		}
	} catch (error) {
		res.status(400).send("Program error!!!");
	}
};

module.exports = { showAllComment, insertComment, updateComment, deleteComment, getDataByRecipeId };
