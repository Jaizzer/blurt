const crypto = require("crypto");
const generateRandomString = (bytes = 32) =>
	crypto.randomBytes(bytes).toString("hex");
module.exports = generateRandomString;
