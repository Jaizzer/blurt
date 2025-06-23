const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/userModel.js");
const LocalAccount = require("../models/localAccountModel.js");
const passport = require("passport");
const generateRandomString = require("../utils/generateRandomString.js");
const sendEmailVerification = require("../utils/sendEmailVerification.js");
const getDateTimeAfterMinutes = require("../utils/getDateTimeAfterMinutes.js");

async function signUpPost(req, res, next) {
	// Hash the password
	const passwordHash = await bcrypt.hash(req.body.password, 12);

	// Generate email verification string
	const emailVerificationString = generateRandomString();

	// Add the new user
	const user = await User.add({
		username: req.body.username,
	});

	// Add the new user's account information
	await LocalAccount.add({
		email: req.body.email,
		passwordHash: passwordHash,
		emailVerificationString: emailVerificationString,
		emailVerificationStringExpirationDate: getDateTimeAfterMinutes(5),
		isVerified: false,
		userId: user.id,
	});

	await sendEmailVerification({
		emailAddress: req.body.email,
		emailVerificationString: emailVerificationString,
	});

	// Render sign up success messages
	return res.status(200).render("emailVerificationNotice");
}

async function renderResendVerificationLinkPage(req, res, next) {
	return res.status(200).render("resendVerificationLink", {
		formFieldData: null,
	});
}
async function resendVerificationLink(req, res, next) {
	// Extract the email
	const email = req.body.email;

	// Retrieve the local account that matches the provided email from the database
	const localAccount = await LocalAccount.getByEmail(email);

	if (localAccount && !localAccount.is_verified) {
		// Generate a new email verification string
		const newEmailVerificationString = generateRandomString();

		// Update the email verification string in the database
		await LocalAccount.updateEmailVerificationString({
			id: localAccount.id,
			emailVerificationString: newEmailVerificationString,
			emailVerificationStringExpirationDate: getDateTimeAfterMinutes(5),
		});

		// Send the email verification link
		await sendEmailVerification({
			emailAddress: req.body.email,
			emailVerificationString: newEmailVerificationString,
		});
	}

	// Render email verification page
	return res.status(200).render("emailVerificationNotice");
}

async function verifyUser(req, res, next) {
	// Extract the email verification string
	const { emailVerificationString } = req.params;

	// Get the local account that  matches the verification string
	const localAccount = await LocalAccount.getByEmailVerificationString(
		emailVerificationString
	);

	if (
		localAccount &&
		!localAccount.is_verified &&
		// Check if the email verification string is not yet expired
		Date.now() < localAccount.email_verification_string_expiration_date
	) {
		await LocalAccount.validate(localAccount.id);
		return res.status(200).render("signUpSuccess");
	} else {
		return res.status(400).render("error", {
			title: "Verification Link Invalid",
			message:
				"This verification link is invalid or has already been used.",
			redirectLink: {
				caption: "Resend Verification Link",
				href: "/auth/resendVerificationLink",
			},
		});
	}
}

async function signUpGet(req, res, next) {
	return res.status(200).render("signUp", {
		formFieldData: null,
	});
}

async function signInGet(req, res, next) {
	// Get the attached error message to the request after a failed sign in attempt
	const failedSignInErrorMessage = req.flash("error")[0];
	return res.status(200).render("signIn", {
		formFieldData: {
			emailOrUsername: {
				value: req.flash("emailOrUsername"),
				error:
					failedSignInErrorMessage?.includes("email") ||
					failedSignInErrorMessage?.includes("username")
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
			req.flash("emailOrUsername", req.body.emailOrUsername);
			req.flash("password", req.body.password);

			// Attach the error message to be displayed on the signIn page
			req.flash("error", info.message);

			return res.status(302).redirect("/auth/signIn");
		} else {
			// Render email-verification-sent page if the user signing-in is not yet verified
			if (!user.is_verified) {
				// Render email verification page
				return res.status(200).render("emailVerificationNotice");
			}

			req.logIn(user, function (error) {
				if (error) {
					return next(error);
				} else {
					return res.status(200).redirect("/");
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
			return res.status(302).redirect("/");
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
			return res.status(401).render("error", {
				title: "Google Sign-In Failed",
				message: error
					? error.message
					: "We couldn't log you in with Google. Please try again or use a different sign-in method.",
				redirectLink: null,
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

async function initializeSignInWithGithub(req, res, next) {
	passport.authenticate("github")(req, res, next);
}

async function signInWithGithub(req, res, next) {
	passport.authenticate("github", (error, user, info) => {
		if (error || !user) {
			return res.status(401).render("error", {
				title: "Github Sign-In Failed",
				message: error
					? error.message
					: "We couldn't log you in with Github. Please try again or use a different sign-in method.",
				redirectLink: null,
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
	renderResendVerificationLinkPage: asyncHandler(
		renderResendVerificationLinkPage
	),
	resendVerificationLink: asyncHandler(resendVerificationLink),
	initializeSignInWithGithub: asyncHandler(initializeSignInWithGithub),
	signInWithGithub: asyncHandler(signInWithGithub),
};
