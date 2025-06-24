const { body } = require("express-validator");
const User = require("../models/userModel.js");
const LocalAccount = require("../models/localAccountModel.js");
const LinkedAccount = require("../models/linkedAccountModel.js");

const signUp = [
	body("email")
		.trim()
		.notEmpty()
		.withMessage("Please provide an email.")
		.isEmail()
		.withMessage("Please provide a valid email.")
		.custom(async (value, { req }) => {
			const isEmailAlreadyTaken =
				(await LocalAccount.getByEmail(value)) ||
				(await LinkedAccount.getByEmail(value));
			if (isEmailAlreadyTaken) {
				throw new Error("Email is already taken");
			}
			return true;
		}),

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

	body("password").trim().notEmpty().withMessage("Please provide a password"),

	body("confirmPassword")
		.custom((value, { req }) => {
			return value === req.body.password;
		})
		.withMessage("Passwords must be the same."),
];

const signIn = [
	body("emailOrUsername")
		.trim()
		.notEmpty()
		.withMessage("Please provide an email or a username."),

	body("password").trim().notEmpty().withMessage("Please provide a password"),
];

const resendVerificationLink = [
	body("email")
		.trim()
		.notEmpty()
		.withMessage("Please provide an email.")
		.isEmail()
		.withMessage("Please provide a valid email."),
];

module.exports = {
	signUp,
	signIn,
	resendVerificationLink,
};
