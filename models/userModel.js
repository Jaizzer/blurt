const pool = require("../config/pool.js");

async function add({ username, profilePicture }) {
	try {
		const { rows } = await pool.query(
			`
            INSERT INTO users
            (username, profile_picture)
            VALUES ($1, $2)
            RETURNING *;
        `,
			[username, profilePicture]
		);

		return rows[0];
	} catch (error) {
		console.error("Error inserting user.");
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

async function updateUsername({ username, id }) {
	try {
		await pool.query(
			`
            UPDATE users
            SET username = $1
            WHERE id = $2;
        `,
			[username, id]
		);
		console.log("Username updated successfully.");
	} catch (error) {
		console.error("Error updating username.");
		throw error;
	}
}

async function getWithLocalAccountByEmail(email) {
	try {
		const { rows } = await pool.query(
			`
            SELECT users.id, username, password_hash, email, email_verification_string, is_verified
            FROM users
            INNER JOIN local_accounts
            ON users.id = local_accounts.user_id
            WHERE local_accounts.email = $1
        `,
			[email]
		);
		return rows[0];
	} catch (error) {
		console.error("Error retrieving the user.");
		throw error;
	}
}

async function getWithLocalAccountByUsername(username) {
	try {
		const { rows } = await pool.query(
			`
            SELECT users.id, username, password_hash, email, email_verification_string, is_verified
            FROM users
            INNER JOIN local_accounts
            ON users.id = local_accounts.user_id
            WHERE users.username = $1
        `,
			[username]
		);
		return rows[0];
	} catch (error) {
		console.error("Error retrieving the user.");
		throw error;
	}
}

async function updateProfilePicture({ profilePicture, id }) {
	try {
		await pool.query(
			`
            UPDATE users
            SET profile_picture = $1
            WHERE id = $2;
        `,
			[profilePicture, id]
		);
		console.log("Profile picture updated successfully.");
	} catch (error) {
		console.error("Error updating profile picture.");
		throw error;
	}
}

module.exports = {
	add,
	getById,
	getByUsername,
	updateUsername,
	getWithLocalAccountByEmail,
	getWithLocalAccountByUsername,
	updateProfilePicture,
};
