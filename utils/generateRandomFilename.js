const crypto = require('crypto');
const generateRandomFilename = (bytes = 32) => crypto.randomBytes(bytes).toString("hex");
module.exports = { generateRandomFilename };