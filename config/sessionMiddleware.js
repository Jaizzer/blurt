const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const session = require("express-session");
const sessionStore = require("./sessionStore.js");

module.exports = session({
	store: sessionStore,
	resave: false,
	saveUninitialized: false,
	secret: process.env.SECRET,
	cookie: {
		// 1 day
		maxAge: 1000 * 60 * 60 * 24,
	},
});
