const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../models/userModel.js");

const customFields = {
	// User email instead of the default username
	usernameField: "email",
	passwordField: "password",
};

const verifyCallback = async (email, password, done) => {
	try {
		const user = await User.getByEmail(email);

		if (!user) {
			return done(null, false, { message: "Incorrect email" });
		}

		const isPasswordMatched = await bcrypt.compare(
			password,
			user.password_hash
		);

		if (!isPasswordMatched) {
			return done(null, false, { message: "Incorrect password" });
		}

		return done(null, user);
	} catch (error) {
		return done(error);
	}
};

const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);

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