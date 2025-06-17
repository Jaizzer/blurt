const asyncHandler = require("express-async-handler");

async function rootGet(req, res, next) {
    res.send(`<h1>Hello ${req.user.username}</h1>`)
}

module.exports = {
	rootGet: asyncHandler(rootGet),
};
