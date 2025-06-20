const { body } = require("express-validator");
const User = require("../models/userModel.js");

const signUp = [
	body("email")
		.trim()
		.notEmpty()
		.withMessage("Please provide an email.")
		.isEmail()
		.withMessage("Please provide a valid email.")
		.custom(async (value, { req }) => {
			const isEmailAlreadyTaken = await User.getByEmail(value);
			if (isEmailAlreadyTaken) {
				throw new Error("Email is already taken");
			}
			return true;
		}),

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

	body("password").trim().notEmpty().withMessage("Please provide a password"),

	body("confirmPassword")
		.custom((value, { req }) => {
			return value === req.body.password;
		})
		.withMessage("Passwords must be the same."),
];

const signIn = [
	body("email")
		.trim()
		.notEmpty()
		.withMessage("Please provide an email.")
		.isEmail()
		.withMessage("Please provide a valid email."),

	body("password").trim().notEmpty().withMessage("Please provide a password"),
];

module.exports = {
	signUp,
	signIn,
};
