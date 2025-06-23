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
		.withMessage("Please provide a valid email.")
		.custom(async (value, { req }) => {
			const isEmailAlreadyExisting = await LocalAccount.getByEmail(value);

			if (!isEmailAlreadyExisting) {
				throw new Error(
					"We were unable to find a user with that email. Make sure your Email is correct!"
				);
			}
			return true;
		}),
];

module.exports = {
	signUp,
	signIn,
	resendVerificationLink,
};
