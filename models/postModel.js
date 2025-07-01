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

async function getPostById(id) {
	try {
		const { rows } = await pool.query(
			`
            SELECT posts.id,
                posts.description,
                media.media,
                jsonb_build_object(
                    'username',
                    users.username,
                    'profilePicture',
                    users.profile_picture
                ) AS user,
                posts.date_uploaded,
                feelings.feeling,
                post_likes.likers,
                comments
            FROM posts
                LEFT JOIN (
                    -- Comments table
                    SELECT post_id,
                        jsonb_agg(comments) as comments
                    FROM (
                            SELECT comments.post_id,
                                jsonb_build_object(
                                    'id',
                                    comments.id,
                                    'user',
                                    users.user,
                                    'content',
                                    comments.content,
                                    'likers',
                                    comment_likers
                                ) AS comments
                            FROM comments
                                INNER JOIN (
                                    SELECT id,
                                        json_build_object(
                                            'username',
                                            username,
                                            'profilePicture',
                                            profile_picture
                                        ) AS user
                                    FROM users
                                ) users on comments.user_id = users.id
                                LEFT JOIN (
                                    SELECT comment_id,
                                        jsonb_agg(
                                            jsonb_build_object(
                                                'username',
                                                users.username,
                                                'profilePicture',
                                                users.profile_picture
                                            )
                                        ) AS comment_likers
                                    FROM comment_likes
                                        INNER JOIN users ON comment_likes.user_id = users.id
                                    GROUP BY comment_id
                                ) comment_likes ON comment_likes.comment_id = comments.id
                            ORDER BY comment_id ASC
                        )
                    GROUP BY post_id
                ) COMMENTS ON (posts.id = comments.post_id)
                INNER JOIN users ON users.id = posts.user_id -- Users table
                LEFT JOIN (
                    -- Feelings table
                    SELECT feelings.id,
                        jsonb_build_object('name', feelings.name, 'emoji', feelings.emoji) AS feeling
                    FROM feelings
                ) feelings ON feelings.id = posts.feeling_id
                LEFT JOIN (
                    -- Post Likes table
                    SELECT post_id,
                        jsonb_agg(
                            jsonb_build_object(
                                'username',
                                users.username,
                                'profilePicture',
                                users.profile_picture
                            )
                        ) AS likers
                    FROM post_likes
                        INNER JOIN users on post_likes.user_id = users.id
                    GROUP BY post_id
                ) post_likes ON (post_likes.post_id = posts.id)
                LEFT JOIN (
                    -- Media table
                    SELECT media.post_id,
                        jsonb_agg(media.name) AS media
                    FROM media
                    GROUP BY media.post_id
                ) media ON media.post_id = posts.id
            WHERE posts.id = $1;
        `,
			[id]
		);
		return rows[0];
	} catch (error) {
		console.error("Error retrieving post.");
		throw error;
	}
}

module.exports = {
	add,
	getAllFeelings,
	getPostById,
};
