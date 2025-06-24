const asyncHandler = require("express-async-handler");
const passport = require("passport");
const authServices = require("../services/authServices.js");

async function signUpPost(req, res, next) {
    // Register the user 
	await authServices.registerLocalUser({
		email: req.body.email,
		username: req.body.username,
		password: req.body.password,
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
	// Resend verification link to the provided email if its associated with an unverified account
	await authServices.resendEmailVerificationLink(req.body.email);

	// Render email verification page
	return res.status(200).render("emailVerificationNotice");
}

async function verifyUser(req, res, next) {
	// Extract the email verification string
	const { emailVerificationString } = req.params;

	// Verify a user using the email verification string
	const isVerificationSuccess = (
		await authServices.verifyUser(emailVerificationString)
	).success;

	if (isVerificationSuccess) {
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
	(await authServices.generatePassportLoginHandler("google"))(req, res, next);
}

async function initializeSignInWithGithub(req, res, next) {
	passport.authenticate("github")(req, res, next);
}

async function signInWithGithub(req, res, next) {
	(await authServices.generatePassportLoginHandler("github"))(req, res, next);
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
