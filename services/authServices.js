const bcrypt = require("bcrypt");
const generateRandomString = require("../utils/generateRandomString.js");
const getDateTimeAfterMinutes = require("../utils/getDateTimeAfterMinutes.js");
const LocalAccount = require("../models/localAccountModel.js");
const User = require("../models/userModel.js");
const emailServices = require("../services/emailServices.js");
const passport = require("passport");
const capitalize = require("../utils/capitalize.js");

async function registerLocalUser({ username, email, password }) {
	// Hash the password
	const passwordHash = await bcrypt.hash(password, 12);

	// Generate email verification string
	const emailVerificationString = generateRandomString();

	// Add the new user
	const user = await User.add({
		username: username,
	});

	// Add the new user's account information
	await LocalAccount.add({
		email: email,
		passwordHash: passwordHash,
		emailVerificationString: emailVerificationString,
		emailVerificationStringExpirationDate: getDateTimeAfterMinutes(5),
		isVerified: false,
		userId: user.id,
	});

	await emailServices.sendEmailVerification({
		emailAddress: email,
		emailVerificationString: emailVerificationString,
	});
}

async function resendEmailVerificationLink(email) {
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
		await emailServices.sendEmailVerification({
			emailAddress: email,
			emailVerificationString: newEmailVerificationString,
		});
	}
}

async function verifyUser(emailVerificationString) {
	// Get the local account that  matches the verification string
	const localAccount = await LocalAccount.getByEmailVerificationString(
		emailVerificationString
	);

	// Check if the email verification string is usable for user verification
	const isEligibleForVerification =
		localAccount &&
		!localAccount.is_verified &&
		Date.now() < localAccount.email_verification_string_expiration_date;

	if (isEligibleForVerification) {
		await LocalAccount.validate(localAccount.id);
		return {
			success: true,
		};
	} else {
		return {
			success: false,
		};
	}
}

async function generatePassportLoginHandler(provider) {
	return function (req, res, next) {
		passport.authenticate(provider, (error, user, info) => {
			if (error || !user) {
				return res.status(401).render("error", {
					title: `${capitalize(provider)} Sign-In Failed`,
					message: error
						? error.message
						: `We couldn't log you in with ${capitalize(
								provider
						  )}. Please try again or use a different sign-in method.`,
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
	};
}

module.exports = {
	registerLocalUser,
	resendEmailVerificationLink,
	verifyUser,
	generatePassportLoginHandler,
};
