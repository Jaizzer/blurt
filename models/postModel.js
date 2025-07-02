const pool = require("../config/pool.js");

async function add({
	description,
	userId,
	mediaUploads,
	feelingId,
	dateUploaded,
	parentPostId,
}) {
	try {
		const { rows } = await pool.query(
			`
            INSERT INTO posts
            (description, user_id, feeling_id, date_uploaded, date_updated, parent_post_id)
            VALUES ($1, $2, $3, $4, $4, $5)
            RETURNING *;
        `,
			[description, userId, feelingId, dateUploaded, parentPostId]
		);

		const postId = rows[0].id;

		// If there are media uploads, save them in the database as children posts
		if (mediaUploads) {
			for (const mediaUpload of mediaUploads) {
				let childPostId = await add({
					parentPostId: postId,
					dateUploaded,
				});
				await saveMediaUpload({ mediaUpload, postId: childPostId });
			}
		}

		console.log("Post saved successfully.");

		return postId;
	} catch (error) {
		console.error("Error saving post.");
		throw error;
	}
}

async function saveMediaUpload({ mediaUpload, postId }) {
	try {
		await pool.query(
			`
                    INSERT INTO media
                    (name, post_id)
                    VALUES ($1, $2);
                `,
			[mediaUpload, postId]
		);
		console.log("Media upload saved successfully.");
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
                posts.parent_post_id,
                posts.date_uploaded,
                users.user,
                feeling,
                likers,
                comments,
                media
            FROM (
                    -- Posts table
                    SELECT child_posts.id,
                        CASE
                            WHEN child_posts.parent_post_id IS NULL THEN child_posts.description
                            ELSE parent_posts.description
                        END AS description,
                        CASE
                            WHEN child_posts.parent_post_id IS NULL THEN child_posts.user_id
                            ELSE parent_posts.user_id
                        END AS user_id,
                        CASE
                            WHEN child_posts.parent_post_id IS NULL THEN child_posts.feeling_id
                            ELSE parent_posts.feeling_id
                        END AS feeling_id,
                        child_posts.date_uploaded,
                        child_posts.parent_post_id
                    FROM posts AS child_posts
                        LEFT JOIN posts AS parent_posts ON child_posts.parent_post_id = parent_posts.id
                ) AS posts
                INNER JOIN (
                    SELECT id,
                        jsonb_build_object(
                            'username',
                            users.username,
                            'profilePicture',
                            users.profile_picture
                        ) AS user
                    FROM users
                ) users ON (users.id = posts.user_id)
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
                ) comments ON (posts.id = comments.post_id)
                LEFT JOIN (
                    SELECT *
                    FROM (
                            (
                                SELECT posts.parent_post_id AS post_id,
                                    jsonb_agg(
                                        jsonb_build_object('post_id', posts.id, 'filename', media.name)
                                    ) as media
                                FROM posts
                                    LEFT JOIN media ON posts.id = media.post_id
                                WHERE parent_post_id IS NOT NULL
                                GROUP BY posts.parent_post_id
                            )
                            UNION
                            (
                                SELECT posts.id AS post_id,
                                    jsonb_agg(
                                        jsonb_build_object('post_id', posts.id, 'filename', media.name)
                                    ) as media
                                FROM posts
                                    LEFT JOIN media ON posts.id = media.post_id
                                WHERE parent_post_id IS NOT NULL
                                GROUP BY posts.id
                            )
                        )
                ) media ON (media.post_id = posts.id)
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
