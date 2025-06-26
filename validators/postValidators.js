const { body } = require("express-validator");
const postServices = require("../services/postServices.js");

const createPost = [
	body("postDescription")
		.trim()
		.notEmpty()
		.withMessage("Please provide a post description")
		.isLength({ max: 63206 })
		.withMessage(
			"Oops! Your post is a bit too long. Please keep it under 63,206 characters"
		),

	body("feeling")
		.custom(async (value, { req }) => {
			const feelings = await postServices.getAllFeelings();
			const feelingIds = feelings.map((feeling) => {
				return feeling.id;
			});
			return feelingIds.includes(parseInt(value));
		})
		.withMessage("Invalid feeling value."),

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
