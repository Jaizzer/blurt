const asyncHandler = require("express-async-handler");

async function renderCreatePostPage(req, res, next) {
	return res.status(200).render("createPost", {
		formFieldData: null,
	});
}

async function createPost(req, res, next) {
	const { postDescription } = req.body;
	return res.status(302).redirect("/");
}

module.exports = {
	renderCreatePostPage: asyncHandler(renderCreatePostPage),
	createPost: asyncHandler(createPost),
};
