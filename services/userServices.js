const User = require("../models/userModel.js");
const storageServices = require("../services/storageServices.js");

const generateRandomString = require("../utils/generateRandomString.js");

async function updateProfilePicture({
	userId,
	newProfilePicture,
	currentProfilePicture,
}) {
	try {
		// Delete the previous profile picture if the user was the one that uploaded it
		const isCurrentProfilePictureUploadedByTheUser =
			currentProfilePicture !==
			process.env.DEFAULT_PROFILE_PICTURE_FILENAME;
		if (isCurrentProfilePictureUploadedByTheUser) {
			await storageServices.deleteFile(currentProfilePicture);
		}

		// Hash the filename
		newProfilePicture.fileName = generateRandomString();

		// Save the profile picture to the cloud in
		await storageServices.uploadFile({
			file: newProfilePicture.file,
			fileName: newProfilePicture.fileName,
			fileType: newProfilePicture.fileType,
		});

		// Save the profile picture filename to the database
		await User.updateProfilePicture({
			profilePicture: newProfilePicture.fileName,
			id: userId,
		});

		return {
			success: true,
			message: "Profile Picture updated successfully",
		};
	} catch (error) {
		return {
			success: false,
			message: error.message,
		};
	}
}

module.exports = {
	updateProfilePicture,
};
