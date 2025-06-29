// Load the file path management module
const path = require("path");

// Load the environment variables
const dotenv = require("dotenv");
dotenv.config();

// Load ejs layout
const expressLayouts = require("express-ejs-layouts");

// Load pre-configured session middleware
const sessionMiddleware = require("./config/session.js");

// Setup the server
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
app.listen(PORT, (error) => {
	if (error) {
		console.error(`Failed to start server: ${error}`);
	} else {
		const baseUrl =
			process.env.NODE_ENVIRONMENT === "PRODUCTION"
				? process.env.PRODUCTION_URL
				: `http://localhost:${PORT}`;
		console.log(`Server is listening on: ${baseUrl}`);
	}
});

// Load passport for user authentication
const passport = require("passport");

// Load connect-flash to store messages for page redirects
const flash = require("connect-flash");
app.use(flash());

// Encode data into key-value pairs
app.use(express.urlencoded({ extended: true }));

// Serve public files
app.use(express.static(path.join(__dirname, "public")));

// Use ejs layouts
app.use(expressLayouts);

// Setup views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Place all <script> blocks at the end of the HTML body to support view-specific scripts in layouts
app.set("layout extractScripts", true);

// Apply session middleware to handle user sessions (e.g., login state, cookies)
app.use(sessionMiddleware);

// Load and configure the Passport strategies
require("./config/passport.js");

// Initialize Passport and enable session-based authentication
app.use((req, res, next) => {
	passport.initialize()(req, res, next);
});
app.use((req, res, next) => {
	passport.session()(req, res, next);
});

// Make the user data available in every views
app.use((req, res, next) => {
	res.locals.user = req.user;
	return next();
});

// Root router
const rootRouter = require("./routes/rootRouter");
app.use("/", rootRouter);

// Authentication router
const authRouter = require("./routes/authRouter");
app.use("/auth", authRouter);

// Post router
const postRouter = require("./routes/postRouter.js");
app.use("/post", postRouter);

// Main error-handling middleware
app.use((error, req, res, next) => {
	console.error(error.stack);
	const statusCode = error.statusCode || error.status || 500;
	const message = error.message || "Internal server error";
	console.log(message);
	res.status(statusCode).render("error", {
		title: "404 Error",
		message: "Internal Server Error",
		redirectLink: null,
	});
});

// Error handling for uncaught exceptions
process.on("uncaughtException", (error) => {
	console.error(`Uncaught exception: ${error}`);
	process.exit(1);
});
