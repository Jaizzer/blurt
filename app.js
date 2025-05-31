// Load file path management  module
const path = require('path');

// Load environment variables
const dotenv = require("dotenv");
dotenv.config();

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

// Serve public files
app.use(express.static(path.join(__dirname, "public")));

// Setup views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// Test route
app.get('/test-route', (req, res, next) => {
    res.send("<h1>Test Route</h1>");
})

// Root router
const rootRouter = require("./routes/rootRouter");
app.use("/", rootRouter);


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