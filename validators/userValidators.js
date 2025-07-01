const { body } = require("express-validator");

const updateProfilePicture = [
	body("profilePicture")
		.custom((value, { req }) => {
			const imageRegExp = new RegExp("image/*");
			return imageRegExp.test(req.file.mimetype);
		})
		.withMessage("Please only upload an image."),
];

module.exports = {
	updateProfilePicture,
};
