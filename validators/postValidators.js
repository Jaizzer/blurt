const { body } = require("express-validator");

const createPost = [
	body("postDescription")
		.trim()
		.notEmpty()
		.withMessage("Please provide a post description")
		.isLength({ max: 63206 })
		.withMessage(
			"Oops! Your post is a bit too long. Please keep it under 63,206 characters"
		),

	body("mediaUploads")
		.custom((value, { req }) => {
			const imageRegExp = new RegExp("image/*");
			const isImage = (file) => imageRegExp.test(file.mimetype);
			return req.files.every(isImage);
		})
		.withMessage("Please only upload images."),
];

module.exports = {
	createPost,
};
