const { validationResult } = require("express-validator");

function getFormFieldData(req) {
	// Get the input errors
	const inputErrors = validationResult(req).mapped();

	// Create an object that contains each input field's error and value.
	const formFieldData = {};
	const inputFieldNames = Object.keys(req.body);
	inputFieldNames.forEach((inputFieldName) => {
		const value = inputErrors[inputFieldName]
			? inputErrors[inputFieldName].value
			: req.body[inputFieldName];

		const error = inputErrors[inputFieldName]
			? inputErrors[inputFieldName].msg
			: null;

		formFieldData[inputFieldName] = {
			value,
			error,
		};
	});

	return formFieldData;
}

module.exports = getFormFieldData;
