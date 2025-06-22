const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const bcrypt = require("bcrypt");
const User = require("../models/userModel.js");
const path = require("path");
const isEmailOrUsername = require("../utils/isEmailOrUsername.js");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

passport.use(
	new LocalStrategy(
		{
			// User email instead of the default username
			usernameField: "emailOrUsername",
			passwordField: "password",
		},
		async function (emailOrUsername, password, done) {
			try {
				const user = await User.getByEmail(emailOrUsername) || await User.getByUsername(emailOrUsername);
				const logInMethod = isEmailOrUsername(emailOrUsername);

				if (!user) {
					return done(null, false, {
						message: `Incorrect ${logInMethod}`,
					});
				}

				const isPasswordMatched = await bcrypt.compare(
					password,
					user.password_hash || ""
				);

				if (!isPasswordMatched) {
					return done(null, false, { message: "Incorrect password" });
				}

				return done(null, user);
			} catch (error) {
				return done(error);
			}
		}
	)
);

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: `${
				process.env.NODE_ENVIRONMENT === "PRODUCTION"
					? process.env.PRODUCTION_URL
					: `http://localhost:${process.env.PORT || 5000}`
			}/auth/google/callback`,
			passReqToCallback: true,
		},
		async function (request, accessToken, refreshToken, profile, done) {
			// Check if the user already exists in the database
			let user = await User.getByEmail(profile.email);

			// Check if the gmail is already linked ot another account
			if (user && user.strategy !== "google") {
				return done(
					new Error(
						"This email account is already linked to another account."
					)
				);
			}

			if (!user) {
				// Save the user to the database if it not yet exists
				await User.add({
					email: profile.email,
					isValid: true,
					strategy: "google",
				});

				// Retrieve the newly added user
				user = await User.getByEmail(profile.email);
			}
			return done(null, user);
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	try {
		const user = await User.getById(id);
		done(null, user);
	} catch (error) {
		done(error);
	}
});
