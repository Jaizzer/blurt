const { body } = require("express-validator");
const User = require("../models/userModel.js");

const pickUsername = [
	body("username")
		.trim()
		.notEmpty()
		.withMessage("Please provide a username")
		.isAlphanumeric()
		.withMessage("Please provide alphanumeric username.")
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
