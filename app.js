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
