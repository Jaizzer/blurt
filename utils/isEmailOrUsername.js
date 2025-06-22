function isEmailOrUsername(input) {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(input) ? "email" : "username";
}

module.exports = isEmailOrUsername;
