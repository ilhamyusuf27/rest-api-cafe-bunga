const multer = require("multer");
const maxSize = 1 * 1000 * 1000;

const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "./images/users/");
	},
	filename: (req, file, cb) => {
		cb(null, new Date().getTime() + "-" + file.originalname);
	},
});

const uploadDetail = multer({
	storage: fileStorage,
	fileFilter: (req, file, cb) => {
		if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
			cb(null, true);
		} else {
			cb(new Error("Only .png, .jpg, .jpeg format allowed"), false);
		}
	},
	limits: { fileSize: maxSize },
});

const uploadMidleware = (req, res, next) => {
	try {
		const uploadSingle = uploadDetail.single("photo_profil");
		uploadSingle(req, res, (err) => {
			if (err) {
				if (err.code === "LIMIT_FILE_SIZE") {
					return res.status(400).json({ message: "File too large, maximum 1mb" });
				}
				return res.status(400).json({ message: err.message });
			} else {
				next();
			}
		});
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

module.exports = uploadMidleware;
