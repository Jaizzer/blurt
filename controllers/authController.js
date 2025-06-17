const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const User = require("../models/userModel.js");
const getFormFieldData = require("../utils/getFormFieldData.js");

async function signUpPost(req, res, next) {
	const isThereInputErrors = !validationResult(req).isEmpty();
	if (isThereInputErrors) {
		// Rerender the sign up form with error messages
		return res.render("signUp", {
			formFieldData: getFormFieldData(req),
		});
	} else {
		// Hash the password
		const passwordHash = await bcrypt.hash(req.body.password, 12);

		// Add the new user
		await User.add({
			email: req.body.email,
			username: req.body.username,
			passwordHash: passwordHash,
		});

		// Render sign up success messages
		return res.render("signUpSuccess");
	}
}

async function signUpGet(req, res, next) {
	res.render("signUp", {
		formFieldData: null,
	});
}

async function signInGet(req, res, next) {
	res.render("signIn", {
		formFieldData: null,
	});
}




}

const validateSignUpForm = [
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

module.exports = {
	signUpGet: asyncHandler(signUpGet),
	signUpPost: [validateSignUpForm, asyncHandler(signUpPost)],
	signInGet: asyncHandler(signInGet),
};
