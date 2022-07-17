const model = require('../model/commentModel');

const showAllComment = async (req, res) => {
	try {
		const getData = await model.getAllData();
		if (getData.rowCount > 0) {
			res.send(getData.rows);
		} else {
			res.status(404).send('Data not found');
		}
	} catch (error) {
		console.log(error);
		res.status(400).send('Program error!!!');
	}
};

const insertComment = async (req, res) => {
	try {
		const { content } = req.body;
		const recipe_id = req.params.id;
		const insertData = await model.insertDataComment({ recipe_id, content });
		if (insertData) {
			res.send('Data added successfully');
		} else {
			res.status('400').send('Data failed to change');
		}
	} catch (error) {
		console.log(error);
		res.status(400).send('Program error!!!');
	}
};

const updateComment = async (req, res) => {
	try {
		const { comment_id, content } = req.body;
		const checkData = await model.getCommentById(comment_id);
		if (checkData.rowCount > 0) {
			let inputContent = content || checkData.rows[0]?.content;
			const updateData = await model.updateComment(inputContent, comment_id);
			if (updateData) {
				res.send('Data has been change successfully');
			} else {
				res.status(400).send('Data failed to change');
			}
		} else {
			res.status(404).send('Data not found');
		}
	} catch (error) {
		res.status(400).send('Program error!!!');
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
			res.status(400).send('Comment failed to delete');
		}
	} catch (error) {
		res.status(400).send('Program error!!!');
	}
};

module.exports = { showAllComment, insertComment, updateComment, deleteComment };
