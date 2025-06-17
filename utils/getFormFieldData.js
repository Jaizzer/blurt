function getFormFieldData({ inputValues, inputErrors }) {
	// Create an object that contains each input field's error and value.
	const formFieldData = {};
	const inputFieldNames = Object.keys(inputValues);
	inputFieldNames.forEach((inputFieldName) => {
		const value = inputErrors[inputFieldName]
			? inputErrors[inputFieldName].value
			: inputValues[inputFieldName];

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
