const { validationResult } = require("express-validator");
const getFormFieldData = require("../utils/getFormFieldData.js");
const postServices = require("../services/postServices.js");

async function validateCreatePostForm(req, res, next) {
	// Retrieve all feelings from the database
	const feelings = await postServices.getAllFeelings();

	const isThereError = !validationResult(req).isEmpty();
	if (isThereError) {
		// Render errors in the form
		return res.status(200).render("createPost", {
			formFieldData: getFormFieldData({
				inputValues: { ...req.body, mediaUploads: null },
				inputErrors: validationResult(req).mapped(),
			}),
			feelings: feelings,
		});
	} else {
		return next();
	}
}

module.exports = { validateCreatePostForm };
