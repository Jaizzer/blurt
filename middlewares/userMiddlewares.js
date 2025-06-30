const { validationResult } = require("express-validator");
const getFormFieldData = require("../utils/getFormFieldData.js");
const storageServices = require("../services/storageServices.js");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

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

async function attachUserProfileData(req, res, next) {
	try {
		if (!req.user) {
			return next();
		}

		// Attach the profile picture url to the user
		req.user.profile_picture =
			req.user.profile_picture ||
			process.env.DEFAULT_PROFILE_PICTURE_FILENAME;
		req.user.profilePictureUrl = await storageServices.getFileUrl(
			req.user.profile_picture
		);

		// Make user accessible to all views
		res.locals.user = req.user;

		return next();
	} catch (error) {
		console.error("Failed to attach user profile data. ", error);
		next(error);
	}
}

module.exports = {
	validateUpdateProfilePictureForm,
	attachUserProfileData,
};
