const { validationResult } = require("express-validator");
const getFormFieldData = require("../utils/getFormFieldData.js");

async function validateSignInForm(req, res, next) {
	const isThereError = !validationResult(req).isEmpty();
	if (isThereError) {
		// Render errors in the form
		return res.render("signIn", {
			formFieldData: getFormFieldData(req),
		});
	} else {
		return next();
	}
}

module.exports = { validateSignInForm };
