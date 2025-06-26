const { Client } = require("pg");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const query = `
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    first_name TEXT NOT NULL,
    last_name TEXT,
    username VARCHAR(26) NOT NULL,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    isAdmin BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS feelings (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL,
    emoji TEXT
);

INSERT INTO feelings (name, emoji) 
VALUES 
    ('loved', '🥰'), 
    ('sad', '😔'), 
    ('angry', '😤'), 
    ('nervous', '😬'), 
    ('cool', '😎'), 
    ('silly', '🤪'), 
    ('sick', '🤒'), 
    ('celebratory', '🥳');

CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title VARCHAR(100),
    content TEXT,
    user_id INTEGER,
    date_uploaded TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    feeling_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (feeling_id) REFERENCES feelings(id)
);

CREATE TABLE IF NOT EXISTS post_likes (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id INTEGER,
    post_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (post_id) REFERENCES posts(id)
);
`;

const query2 = `
CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id INTEGER,
    post_id INTEGER,
    content TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (post_id) REFERENCES posts(id)
);

CREATE TABLE IF NOT EXISTS comment_likes (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id INTEGER,
    comment_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (comment_id) REFERENCES comments(id)
);
`;

const query3 = `
ALTER TABLE users
DROP COLUMN salt;
`;

const query4 = `
ALTER TABLE users
DROP COLUMN first_name,
DROP COLUMN last_name,
DROP COLUMN isadmin;
`;

const query5 = `
ALTER TABLE users
ADD email VARCHAR(320);
`;

const query6 = `
    CREATE TABLE "session" (
        "sid" varchar NOT NULL COLLATE "default",
        "sess" json NOT NULL,
        "expire" timestamp(6) NOT NULL
    ) WITH (OIDS = FALSE);
    ALTER TABLE "session"
    ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
    CREATE INDEX "IDX_session_expire" ON "session" ("expire");
`;

const query7 = `
    ALTER TABLE users
    ADD COLUMN email_verification_string TEXT ,
    ADD COLUMN is_valid BOOLEAN DEFAULT FALSE;
`;

const query8 = `
    ALTER TABLE users
    DROP CONSTRAINT email_verification_string;
`;

const query9 = `
    ALTER TABLE users
    ALTER COLUMN username DROP NOT NULL,
    ALTER COLUMN password_hash DROP NOT NULL;
`;

const query10 = `
    ALTER TABLE users
    ADD COLUMN strategy TEXT NOT NULL;
`;

const query11 = `
    ALTER TABLE users
    DROP COLUMN password_hash,
    DROP COLUMN email,
    DROP COLUMN email_verification_string,
    DROP COLUMN is_valid,
    DROP COLUMN STRATEGY;
`;

const query12 = `
    CREATE TABLE IF NOT EXISTS local_accounts (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        password_hash TEXT NOT NULL,
        email VARCHAR(320) NOT NULL,
        email_verification_string TEXT NOT NULL,
        is_verified BOOLEAN NOT NULL,
        user_id INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS linked_accounts (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        provider TEXT NOT NULL,
        provider_user_id TEXT NOT NULL,
            user_id INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
    );
`;

const query13 = `
    ALTER TABLE linked_accounts
    ADD COLUMN email TEXT;
`;

const query14 = `
    ALTER TABLE local_accounts
    ADD COLUMN email_verification_string_expiration_date TIMESTAMP;
`;

const query15 = `
    ALTER TABLE posts
    DROP COLUMN title;

    ALTER TABLE posts
    RENAME COLUMN content TO description
`;

const query16 = `
    CREATE TABLE IF NOT EXISTS media (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name TEXT NOT NULL,
        post_id INTEGER,
        FOREIGN KEY (post_id) REFERENCES posts(id)
);
`;

const query17 = `
    DELETE FROM feelings
    WHERE id >=9;
`


async function main() {
	let client;
	try {
		const connectionString =
			process.argv[2] === "PRODUCTION"
				? process.env.PRODUCTION_DB_URL
				: process.env.LOCAL_DB_URL;

		if (!connectionString) {
			throw new Error(
				"Database URL not defined in environment variables."
			);
		}

		client = new Client({
			connectionString: connectionString,
			ssl:
				process.argv[2] === "PRODUCTION"
					? {
							rejectUnauthorized: false,
					  }
					: false,
		});

		await client.connect();

		await client.query(query17);

		console.log(`Database setup complete.`);
	} catch (error) {
		console.error(`Error during database setup. ${error}`);
	} finally {
		if (client) {
			try {
				await client.end();
				console.log(`Database connection closed successfully.`);
			} catch (endError) {
				console.error(`Error closing database connection. ${endError}`);
			}
		}
	}
}
main();
