const Router = require('express').Router();
const controller = require('../controller/usersController');

const multer = require('multer');

const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, './images/users/');
	},
	filename: (req, file, cb) => {
		cb(null, new Date().getTime() + '-' + file.originalname);
	},
});

const upload = multer({ storage: fileStorage });

Router.get('/users', controller.getDataUsers);
Router.get('/users/id', controller.getDataById);
Router.post('/registration', upload.single('photo_profile'), controller.insertNewUser);
Router.patch('/users/update', controller.updateUser);
Router.delete('/users/delete', controller.deleteUser);

module.exports = Router;
