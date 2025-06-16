const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const db = require("../models/signUpModel.js");

async function signUpPost(req, res, next) {
	const isThereInputErrors = !validationResult(req).isEmpty();
	if (isThereInputErrors) {
		// Get the input errors
		const inputErrors = validationResult(req).mapped();

		// Create an object that contains each input field's error and value.
		const inputFields = {};
		const inputFieldNames = Object.keys(req.body);
		inputFieldNames.forEach((inputFieldName) => {
			const value = inputErrors[inputFieldName]
				? inputErrors[inputFieldName].value
				: req.body[inputFieldName];

			const error = inputErrors[inputFieldName]
				? inputErrors[inputFieldName].msg
				: null;

			Object.defineProperty(inputFields, inputFieldName, {
				value: {
					value,
					error,
				},
				writable: true,
				enumerable: true,
				configurable: true,
			});
		});

		// Rerender the sign up form with error messages
		res.render("signUp", {
			inputFields,
		});
	} else {
		// Hash the password
		const passwordHash = await bcrypt.hash(req.body.password, 12);

		// Add the new user
		await db.addUser({
			email: req.body.email,
			username: req.body.username,
			passwordHash: passwordHash,
		});

		// Render sign up success messages
		res.render("signUpSuccess");
	}
}

async function signUpGet(req, res, next) {
	res.render("signUp", {
		inputFields: null,
	});
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
};
