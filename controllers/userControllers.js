const asyncHandler = require("express-async-handler");
const userServices = require("../services/userServices.js");

async function renderUpdateProfilePicturePage(req, res, next) {
	return res.status(200).render("updateProfilePicture", {
		formFieldData: null,
	});
}

async function updateProfilePicture(req, res, next) {
	// Extract the only necessary file data
	const newProfilePicture = {
		file: req.file.buffer,
		fileName: req.file.originalname,
		fileType: req.file.mimetype,
	};

	// Update the user's profile picture
	let response = await userServices.updateProfilePicture({
		newProfilePicture: newProfilePicture,
		currentProfilePicture: req.user.profile_picture,
		userId: req.user.id,
	});

	if (response.success) {
		return res.status(302).redirect("/");
	} else {
		// Render error message if the profile picture update failed.
		return res.status(500).render("error", {
			title: "Server Error",
			message:
				response.message,
			redirectLink: {
				href: "/",
				caption: "Back to Home",
			},
		});
	}
}

module.exports = {
	renderUpdateProfilePicturePage: asyncHandler(
		renderUpdateProfilePicturePage
	),
	updateProfilePicture: asyncHandler(updateProfilePicture),
};
