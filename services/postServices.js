const Post = require("../models/postModel.js");
const storageServices = require("../services/storageServices.js");
const capitalize = require("../utils/capitalize.js");
const generateRandomString = require("../utils/generateRandomString.js");

async function savePost({ description, mediaUploads, userId, feelingId }) {
	// Hash the filenames
	mediaUploads.forEach((mediaUpload) => {
		mediaUpload.fileName = generateRandomString();
	});

	// Same the media uploads to the cloud in-parallel
	await Promise.all(
		mediaUploads.map((mediaUpload) => {
			return storageServices.uploadFile({
				file: mediaUpload.file,
				fileName: mediaUpload.fileName,
				fileType: mediaUpload.fileType,
			});
		})
	);

	// Save the post to the database
	await Post.add({
		description: description,
		userId: userId,
		mediaUploads: mediaUploads?.map(
			(mediaUploads) => mediaUploads.fileName
		),
		feelingId: feelingId,
		dateUploaded: new Date(),
	});
}

async function getAllFeelings() {
	return (await Post.getAllFeelings()).map((feeling) => ({
		...feeling,
		name: capitalize(feeling.name),
	}));
}

module.exports = {
	savePost,
	getAllFeelings,
};
