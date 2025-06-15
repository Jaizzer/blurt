const pool = require("./pool.js");

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

module.exports = {
	addUser,
};
