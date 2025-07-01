const { validationResult } = require("express-validator");
const getFormFieldData = require("../utils/getFormFieldData.js");

async function validateUpdateProfilePictureForm(req, res, next) {
	const isThereError = !validationResult(req).isEmpty();
	if (isThereError) {
		// Render errors in the form
		return res.status(200).render("updateProfilePicture", {
			formFieldData: getFormFieldData({
				inputValues: { ...req.body, profilePicture: null },
				inputErrors: validationResult(req).mapped(),
			}),
		});
	} else {
		return next();
	}
}

module.exports = { validateUpdateProfilePictureForm };
