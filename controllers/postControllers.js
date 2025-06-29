const asyncHandler = require("express-async-handler");
const postServices = require("../services/postServices.js");

async function renderCreatePostPage(req, res, next) {
	// Retrieve all feelings from the database
	const feelings = await postServices.getAllFeelings();

	return res.status(200).render("createPost", {
		formFieldData: null,
		feelings: feelings,
	});
}

async function createPost(req, res, next) {
	// Extract the only necessary file data
	const mediaUploads = req.files.map((file) => ({
		file: file.buffer,
		fileName: file.originalname,
		fileType: file.mimetype,
	}));

	await postServices.savePost({
		description: req.body.postDescription,
		mediaUploads: mediaUploads,
		userId: req.user.id,
		feelingId: req.body.feeling,
	});

	return res.status(302).redirect("/");
}

module.exports = {
	renderCreatePostPage: asyncHandler(renderCreatePostPage),
	createPost: asyncHandler(createPost),
};
