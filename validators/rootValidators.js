const { body } = require("express-validator");
const User = require("../models/userModel.js");

const pickUsername = [
	body("username")
		.trim()
		.notEmpty()
		.withMessage("Please provide a username")
		.isLength({ min: 2, max: 24 })
		.withMessage("Username must be between 2 to 24 characters.")
		.matches(/^(?!.*[._]{2})(?![._])[a-zA-Z0-9._]+(?<![._])$/)
		.withMessage(
			"Username can have letters, numbers, dots, or underscores—no starting, ending, or repeating dots/underscores."
		)
		.custom(async (value, { req }) => {
			const isUsernameAlreadyTaken = await User.getByUsername(value);
			if (isUsernameAlreadyTaken) {
				throw new Error("Username is already taken");
			}
			return true;
		}),
];

module.exports = {
	pickUsername,
};
