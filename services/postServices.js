const Post = require("../models/postModel.js");
const storageServices = require("../services/storageServices.js");
const generateRandomString = require("../utils/generateRandomString.js");

async function savePost({ description, mediaUploads, userId, feelingId }) {
	console.log("Debug line 3");

	// Save the media uploads into cloud
	mediaUploads?.forEach(async (mediaUpload) => {
		// Hash the filenames
		const hashedFilename = generateRandomString();
		mediaUpload.fileName = hashedFilename;

		console.log("Debug line 1");
		console.time("timer");
		storageServices.uploadFile({
			file: mediaUpload.file,
			fileName: mediaUpload.fileName,
			fileType: mediaUpload.fileType,
		});

		console.timeEnd("timer");

		console.log("Debug line 2");
	});

	console.log("Debug line 4");

	// Save the post to the database
	await Post.add({
		description: description,
		userId: userId,
		mediaUploads: mediaUploads?.map(
			(mediaUploads) => mediaUploads.fileName
		),
		feeling: feelingId,
		dateUploaded: new Date(),
	});
}

module.exports = {
	savePost,
};
