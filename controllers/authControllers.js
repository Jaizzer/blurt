const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/userModel.js");
const passport = require("passport");

async function signUpPost(req, res, next) {
	// Hash the password
	const passwordHash = await bcrypt.hash(req.body.password, 12);

	// Add the new user
	await User.add({
		email: req.body.email,
		username: req.body.username,
		passwordHash: passwordHash,
	});

	// Render sign up success messages
	return res.render("signUpSuccess");
}

async function signUpGet(req, res, next) {
	return res.render("signUp", {
		formFieldData: null,
	});
}

async function signInGet(req, res, next) {
	// Get the attached error message to the request after a failed sign in attempt
	const failedSignInErrorMessage = req.flash("error")[0];
	return res.render("signIn", {
		formFieldData: {
			email: {
				value: req.flash("email"),
				error: failedSignInErrorMessage?.includes("email")
					? failedSignInErrorMessage
					: null,
			},
			password: {
				value: req.flash("password"),
				error: failedSignInErrorMessage?.includes("password")
					? failedSignInErrorMessage
					: null,
			},
		},
	});
}

async function signInPost(req, res, next) {
	passport.authenticate("local", (error, user, info) => {
		if (error) {
			return next(error);
		}

		if (!user) {
			// Make the user input persist even after redirecting to signIn page
			req.flash("email", req.body.email);
			req.flash("password", req.body.password);

			// Attach the error message to be displayed on the signIn page
			req.flash("error", info.message);

			return res.redirect("/auth/signIn");
		} else {
			req.logIn(user, function (error) {
				if (error) {
					return next(error);
				} else {
					return res.redirect("/");
				}
			});
		}
	})(req, res, next);
}

module.exports = {
	signUpGet: asyncHandler(signUpGet),
	signUpPost: asyncHandler(signUpPost),
	signInGet: asyncHandler(signInGet),
	signInPost: asyncHandler(signInPost),
};
