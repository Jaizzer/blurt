const pool = require("../config/pool.js");

async function addUser(user) {
	try {
		const { username, email, passwordHash } = user;
		await pool.query(
			`
            INSERT INTO users
            (username, email, password_hash)
            VALUES ($1, $2, $3);
        `,
			[username, email, passwordHash]
		);
	} catch (error) {
		console.error("Error inserting user. ", error.replace("Error:", ""));
	}
}

async function getUserById(id) {
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
		console.error("Error retrieving user. ", error.replace("Error:", ""));
	}
}

async function getUserByUsername(username) {
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
		console.error("Error retrieving user. ", error.replace("Error:", ""));
	}
}

async function getUserByEmail(email) {
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
		console.error("Error retrieving user. ", error.replace("Error:", ""));
	}
}

module.exports = {
	addUser,
	getUserById,
	getUserByUsername,
	getUserByEmail,
};
