const asyncHandler = require("express-async-handler");
const User = require("../models/userModel.js");

async function rootGet(req, res, next) {
	const username = req.user.username;
	if (!username) {
		// Render the pick username form if the user does not yet have a username
		return res.status(200).redirect("/pickUsername");
	} else {
		// Render the feed if the user already has a username
		return res.status(200).render("feed");
	}
}

async function pickUsernameGet(req, res, next) {
	const username = req.user.username;
	if (username) {
		// Render the feed if the user already has a username
		return res.status(302).redirect("/");
	} else {
		// Render the pick username form if the user does not yet have a username
		return res.status(200).render("pickUsername", {
			formFieldData: null,
		});
	}
}

async function pickUsernamePost(req, res, next) {
	// Update the user's username
	await User.updateUsername({
		username: req.body.username,
		id: req.user.id,
	});
	return res.status(302).redirect("/");
}

module.exports = {
	rootGet: asyncHandler(rootGet),
	pickUsernameGet: asyncHandler(pickUsernameGet),
	pickUsernamePost: asyncHandler(pickUsernamePost),
};
