const { validationResult } = require("express-validator");
const getFormFieldData = require("../utils/getFormFieldData.js");

async function validateSignInForm(req, res, next) {
	const isThereError = !validationResult(req).isEmpty();
	if (isThereError) {
		// Render errors in the form
		return res.render("signIn", {
			formFieldData: getFormFieldData({
				inputValues: req.body,
				inputErrors: validationResult(req).mapped(),
			}),
		});
	} else {
		return next();
	}
}

async function validateSignUpForm(req, res, next) {
	const isThereInputErrors = !validationResult(req).isEmpty();
	if (isThereInputErrors) {
		// Rerender the sign up form with error messages
		return res.render("signUp", {
			formFieldData: getFormFieldData({
				inputValues: req.body,
				inputErrors: validationResult(req).mapped(),
			}),
		});
	} else {
		return next();
	}
}

async function isAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		// Redirect the user to the sign in page if he/she is not yet authenticated
		return res.redirect("/auth/signIn");
	}
}

module.exports = { validateSignInForm, validateSignUpForm, isAuthenticated };
