const model = require("../model/commentModel");

const showAllComment = async (req, res) => {
	try {
		const getData = await model.getAllData();
		if (getData.rowCount > 0) {
			res.status(200).json({ data: getData.rows });
		} else {
			res.status(404).json({ message: "Data not found" });
		}
	} catch (error) {
		res.status(400).json({ message: "Program error!!!" });
	}
};

const insertComment = async (req, res) => {
	try {
		const { comment, user_id } = req.body;
		const recipe_id = req.params.id;
		const insertData = await model.insertDataComment({ recipe_id, comment, user_id });
		if (insertData) {
			const getData = await model.getCommentByRecipeId(recipe_id);
			res.status(200).json({ message: "Comment added successfully", result: getData.rows });
		} else {
			res.status(400).json({ message: "Comment failed" });
		}
	} catch (error) {
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
				res.status(200).json({ message: "Comment has been change successfully" });
			} else {
				res.status(400).json({ message: "Comment failed to change" });
			}
		} else {
			res.status(404).json({ message: "Comment not found" });
		}
	} catch (error) {
		res.status(400).json({ message: "Program error!!!" });
	}
};

const deleteComment = async (req, res) => {
	try {
		const { comment_id } = req.body;
		const getData = await model.getCommentById(comment_id);
		if (getData.rowCount > 0) {
			await model.deleteComment(comment_id);
			res.status(200).json({ message: `Comment deleted successfully` });
		} else {
			res.status(400).json({ message: "Comment failed to delete" });
		}
	} catch (error) {
		res.status(400).json({ message: "Program error!!!" });
	}
};

const getDataByRecipeId = async (req, res) => {
	try {
		const { id } = req.params;
		const getData = await model.getCommentByRecipeId(id);
		if (getData.rowCount > 0) {
			res.status(200).json({
				totalData: getData.rowCount,
				result: getData.rows,
			});
		} else {
			res.status(404).json({ message: "Comment not found" });
		}
	} catch (error) {
		res.status(400).json({ message: "Program error!!!" });
	}
};

module.exports = { showAllComment, insertComment, updateComment, deleteComment, getDataByRecipeId };
