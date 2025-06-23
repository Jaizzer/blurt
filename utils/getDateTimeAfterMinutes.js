function getDateTimeAfterMinutes(minutes) {
	return new Date(Date.now() + minutes * 60 * 1000);
}

module.exports = getDateTimeAfterMinutes;
