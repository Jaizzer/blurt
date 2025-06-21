const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/userModel.js");
const passport = require("passport");
const generateRandomString = require("../utils/generateRandomString.js");
const sendEmailVerification = require("../utils/sendEmailVerification.js");

async function signUpPost(req, res, next) {
	// Hash the password
	const passwordHash = await bcrypt.hash(req.body.password, 12);

	// Generate email verification string
	const emailVerificationString = generateRandomString();

	// Add the new user
	await User.add({
		email: req.body.email,
		username: req.body.username,
		passwordHash: passwordHash,
		emailVerificationString: emailVerificationString,
		isValid: false,
	});

	await sendEmailVerification({
		emailAddress: req.body.email,
		emailVerificationString: emailVerificationString,
	});

	// Render sign up success messages
	return res.render("emailVerification");
}

async function verifyUser(req, res, next) {
	// Extract the email verification string
	const { emailVerificationString } = req.params;

	// Get the user that  matches the verification string
	const user = await User.getByEmailVerificationString(
		emailVerificationString
	);

	if (user) {
		if (!user.is_valid) {
			await User.validate(user.id);
		}
		return res.redirect("/auth/signIn");
	} else {
		return res.render("error", {
			title: "Email Verification Failed",
			message: "User to verify does not exist",
		});
	}
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

async function signOut(req, res, next) {
	req.logout((error) => {
		if (error) {
			return next(error);
		} else {
			return res.redirect("/");
		}
	});
}

async function initializeSignInWithGoogle(req, res, next) {
	passport.authenticate("google", {
		scope: ["profile", "email"],
		prompt: "select_account",
	})(req, res, next);
}

async function signInWithGoogle(req, res, next) {
	passport.authenticate("google", (error, user, info) => {
		if (error || !user) {
			if (error) console.error(error);
			return res.render("error", {
				title: "Google Sign-In Failed",
				message:
					"We couldn't log you in with Google. Please try again or use a different sign-in method.",
			});
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
	verifyUser: asyncHandler(verifyUser),
	signOut: asyncHandler(signOut),
	initializeSignInWithGoogle: asyncHandler(initializeSignInWithGoogle),
	signInWithGoogle: asyncHandler(signInWithGoogle),
};
