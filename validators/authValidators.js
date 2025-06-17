const { body } = require("express-validator");

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
	signIn,
};
