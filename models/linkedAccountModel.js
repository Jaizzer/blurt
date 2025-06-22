const pool = require("../config/pool.js");

async function add({ provider, providerUserId, userId, email }) {
	try {
		const { rows } = await pool.query(
			`
            INSERT INTO linked_accounts
            (provider, provider_user_id, user_id, email)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `,
			[provider, providerUserId, userId, email]
		);
		return rows[0];
	} catch (error) {
		console.error("Error inserting linked account.");
		throw error;
	}
}

async function getById(id) {
	try {
		const { rows } = await pool.query(
			`
            SELECT *
            FROM linked_accounts
            WHERE id = $1;
            `,
			[id]
		);
		const linkedAccount = rows[0];
		return linkedAccount;
	} catch (error) {
		console.error("Error retrieving linked account");
		throw error;
	}
}

async function getByForeignKeyUserId(id) {
	try {
		const { rows } = await pool.query(
			`
            SELECT *
            FROM linked_accounts
            WHERE user_id = $1;
            `,
			[id]
		);
		const linkedAccount = rows[0];
		return linkedAccount;
	} catch (error) {
		console.error("Error retrieving linked account");
		throw error;
	}
}

async function getByEmail(email) {
	try {
		const { rows } = await pool.query(
			`
            SELECT *
            FROM linked_accounts
            WHERE email = $1;
            `,
			[email]
		);
		const linkedAccount = rows[0];
		return linkedAccount;
	} catch (error) {
		console.error("Error retrieving local account");
		throw error;
	}
}

async function getByProviderAndProviderUserId({ provider, providerUserId }) {
	try {
		const { rows } = await pool.query(
			`
            SELECT *
            FROM linked_accounts
            WHERE provider = $1
            AND provider_user_id = $2;
            `,
			[provider, providerUserId]
		);
		const linkedAccount = rows[0];
		return linkedAccount;
	} catch (error) {
		console.error("Error retrieving linked account");
		throw error;
	}
}

module.exports = {
	add,
	getById,
	getByForeignKeyUserId,
	getByEmail,
	getByProviderAndProviderUserId,
};
