const pool = require("../config/pool.js");

async function add(user) {
	try {
		const {
			username,
			email,
			passwordHash,
			emailVerificationString,
			isValid,
		} = user;
		await pool.query(
			`
            INSERT INTO users
            (username, email, password_hash, email_verification_string, is_valid)
            VALUES ($1, $2, $3, $4, $5);
        `,
			[username, email, passwordHash, emailVerificationString, isValid]
		);
	} catch (error) {
		console.error("Error inserting user.");
		throw error;
	}
}

async function getByEmailVerificationString(emailVerificationString) {
	try {
		const { rows } = await pool.query(
			`
            SELECT *
            FROM users
            WHERE email_verification_string = $1;
            `,
			[emailVerificationString]
		);
		const user = rows[0];
		return user;
	} catch (error) {
		console.error("Error retrieving user.");
		throw error;
	}
}

async function validate(id) {
	try {
		await pool.query(
			`
            UPDATE users
            SET is_valid = TRUE
            WHERE id = $1
        `,
			[id]
		);
	} catch (error) {
		console.error("Error validating user.");
		throw error;
	}
}

async function getById(id) {
	try {
		const { rows } = await pool.query(
			`
            SELECT *
            FROM users
            WHERE id = $1;
            `,
			[id]
		);
		const user = rows[0];
		return user;
	} catch (error) {
		console.error("Error retrieving user.");
		throw error;
	}
}

async function getByUsername(username) {
	try {
		const { rows } = await pool.query(
			`
            SELECT *
            FROM users
            WHERE username = $1;
            `,
			[username]
		);
		const user = rows[0];
		return user;
	} catch (error) {
		console.error("Error retrieving user.");
		throw error;
	}
}

async function getByEmail(email) {
	try {
		const { rows } = await pool.query(
			`
            SELECT *
            FROM users
            WHERE email = $1;
            `,
			[email]
		);
		const user = rows[0];
		return user;
	} catch (error) {
		console.error("Error retrieving user.");
		throw error;
	}
}

module.exports = {
	add,
	getById,
	getByUsername,
	getByEmail,
	getByEmailVerificationString,
	validate,
};
