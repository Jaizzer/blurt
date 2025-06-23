const pool = require("../config/pool.js");

async function add({
	email,
	passwordHash,
	emailVerificationString,
	isVerified,
	userId,
	emailVerificationStringExpirationDate,
}) {
	try {
		await pool.query(
			`
            INSERT INTO local_accounts
            (email, password_hash, email_verification_string, is_verified, user_id, email_verification_string_expiration_date)
            VALUES ($1, $2, $3, $4, $5, $6);
        `,
			[
				email,
				passwordHash,
				emailVerificationString,
				isVerified,
				userId,
				emailVerificationStringExpirationDate,
			]
		);
	} catch (error) {
		console.error("Error inserting local account.");
		throw error;
	}
}

async function getByEmailVerificationString(emailVerificationString) {
	try {
		const { rows } = await pool.query(
			`
            SELECT *
            FROM local_accounts
            WHERE email_verification_string = $1;
            `,
			[emailVerificationString]
		);
		const localAccount = rows[0];
		return localAccount;
	} catch (error) {
		console.error("Error retrieving local account.");
		throw error;
	}
}

async function validate(id) {
	try {
		await pool.query(
			`
            UPDATE local_accounts
            SET is_verified = TRUE
            WHERE id = $1
        `,
			[id]
		);
	} catch (error) {
		console.error("Error validating local account.");
		throw error;
	}
}

async function getById(id) {
	try {
		const { rows } = await pool.query(
			`
            SELECT *
            FROM local_accounts
            WHERE id = $1;
            `,
			[id]
		);
		const localAccount = rows[0];
		return localAccount;
	} catch (error) {
		console.error("Error retrieving local account");
		throw error;
	}
}

async function getByForeignKeyUserId(id) {
	try {
		const { rows } = await pool.query(
			`
            SELECT *
            FROM local_accounts
            WHERE user_id = $1;
            `,
			[id]
		);
		const localAccount = rows[0];
		return localAccount;
	} catch (error) {
		console.error("Error retrieving local account");
		throw error;
	}
}

async function getByEmail(email) {
	try {
		const { rows } = await pool.query(
			`
            SELECT *
            FROM local_accounts
            WHERE email = $1;
            `,
			[email]
		);
		const localAccount = rows[0];
		return localAccount;
	} catch (error) {
		console.error("Error retrieving local account");
		throw error;
	}
}

async function updateEmailVerificationString({
	id,
	emailVerificationString,
	emailVerificationStringExpirationDate,
}) {
	try {
		await pool.query(
			`
            UPDATE local_accounts
            SET email_verification_string = $2,
            email_verification_string_expiration_date = $3
            WHERE id = $1;
            `,
			[id, emailVerificationString, emailVerificationStringExpirationDate]
		);
		console.log("Email verification string updated successfully.");
	} catch (error) {
		console.error("Error retrieving local account");
		throw error;
	}
}

module.exports = {
	add,
	getById,
	getByEmail,
	getByEmailVerificationString,
	validate,
	getByForeignKeyUserId,
	updateEmailVerificationString,
};
