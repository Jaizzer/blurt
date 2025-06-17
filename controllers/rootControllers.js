const asyncHandler = require("express-async-handler");

async function rootGet(req, res, next) {
	return res.render("feed");
}

module.exports = {
	rootGet: asyncHandler(rootGet),
};
