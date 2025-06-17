const { body } = require("express-validator");

const signUp = [
	body("email")
		.trim()
		.notEmpty()
		.withMessage("Please provide an email.")
		.isEmail()
		.withMessage("Please provide a valid email."),

	body("username")
		.trim()
		.notEmpty()
		.withMessage("Please provide a username")
		.isAlphanumeric()
		.withMessage("Please provide alphanumeric username."),

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
