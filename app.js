// Load the file path management module
const path = require("path");

// Load the environment variables
const dotenv = require("dotenv");
dotenv.config();

// Load the dependencies for handling multipart/form data
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

// Load ejs layout
const expressLayouts = require("express-ejs-layouts");

// Setup the server
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
app.listen(PORT, (error) => {
	if (error) {
		console.error(`Failed to start server: ${error}`);
	} else {
		const baseUrl =
			process.argv[2] === "PRODUCTION"
				? process.env.PRODUCTION_URL
				: `http://localhost:${PORT}`;
		console.log(`Server is listening on: ${baseUrl}`);
	}
});

// Encode data into key-value pairs
app.use(express.urlencoded({ extended: true }));

// Serve public files
app.use(express.static(path.join(__dirname, "public")));

// Use ejs layouts
app.use(expressLayouts);

// Setup views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Root router
const rootRouter = require("./routes/rootRouter");
app.use("/", rootRouter);

// Sign up router
const signUpRouter = require("./routes/signUpRouter");
app.use("/signUp", signUpRouter);

// Main error-handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	const statusCode = err.statusCode || err.status || 500;
	const message = err.message || "Internal server error";
	console.log(message);
	res.status(statusCode).render("error", {
		title: "404 Error",
		message: "Internal Server Error",
	});
});

// Error handling for uncaught exceptions
process.on("uncaughtException", (error) => {
	console.error(`Uncaught exception: ${error}`);
	process.exit(1);
});
