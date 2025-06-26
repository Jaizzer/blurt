const pool = require("../config/pool.js");

async function add({
	description,
	userId,
	mediaUploads,
	feelingId,
	dateUploaded,
}) {
	try {
		const { rows } = await pool.query(
			`
            INSERT INTO posts
            (description, user_id, feeling_id, date_uploaded)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `,
			[description, userId, feelingId, dateUploaded]
		);

		const postId = rows[0].id;

		// If there are media uploads, save them in the database
		if (mediaUploads) {
			await saveMediaUploads({ mediaUploads, postId });
		}

		console.log("Post save successfully.");
	} catch (error) {
		console.error("Error saving post.");
		throw error;
	}
}

async function saveMediaUploads({ mediaUploads, postId }) {
	try {
		mediaUploads.forEach(async (mediaUpload) => {
			await pool.query(
				`
                    INSERT INTO media
                    (name, post_id)
                    VALUES ($1, $2);
                `,
				[mediaUpload, postId]
			);
		});
	} catch (error) {
		console.error("Error saving media uploads.");
		throw error;
	}
}

async function getAllFeelings() {
	try {
		const { rows } = await pool.query(`
                SELECT *
                FROM feelings;
        `);
		return rows;
	} catch (error) {
		console.error("Error retrieving feelings.");
		throw error;
	}
}

module.exports = {
	add,
	getAllFeelings,
};
