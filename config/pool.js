const { Pool } = require("pg");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

let pool;
try {
	connectionString =
		process.env.NODE_ENVIRONMENT === "PRODUCTION"
			? process.env.PRODUCTION_DB_URL
			: process.env.LOCAL_DB_URL;

	if (!connectionString) {
		throw new Error(
			"Database connection string not found in environment variables."
		);
	}

	pool = new Pool({
		connectionString: connectionString,
		ssl:
			process.env.NODE_ENVIRONMENT === "PRODUCTION"
				? {
						rejectUnauthorized: false,
				  }
				: false,
	});
	console.log("Database pool created successfully.");
} catch (error) {
	console.error("Error creating a database pool. ", error);
	process.exit(1);
}

module.exports = pool;
