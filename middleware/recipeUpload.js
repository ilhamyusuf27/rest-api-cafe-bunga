const multer = require('multer');
const maxSize = 1 * 1000 * 1000;

const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, './images/recipes/');
	},
	filename: (req, file, cb) => {
		cb(null, new Date().getTime() + '-' + file.originalname);
	},
});

const upload = multer({ storage: fileStorage });

const uploadDetail = multer({
	storage: fileStorage,
	fileFilter: (req, file, cb) => {
		if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
			cb(null, true);
		} else {
			cb(new Error('Only .png, .jpg, .jpeg format allowed'), false);
		}
	},
	limits: { fileSize: maxSize },
});

const uploadMidleware = (req, res, next) => {
	const uploadSingle = uploadDetail.single('recipe_images');
	uploadSingle(req, res, (err) => {
		if (err) {
			return res.status(400).send(err.message);
		} else {
			next();
		}
	});
};

module.exports = uploadMidleware;
