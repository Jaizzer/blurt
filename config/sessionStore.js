const connectPgSimple = require("connect-pg-simple");
const session = require("express-session");
const pool = require("./pool.js");

const PgStore = new (connectPgSimple(session))({
	pool: pool,
	tableName: "session",
});

module.exports = PgStore;
