const inputFields = document.querySelectorAll(".inputField");

if (inputFields) {
	inputFields.forEach((inputField) => {
		inputField.addEventListener("input", () => {
			// Access the error message element
			const errorMessage = inputField.querySelector(".errorMessage");

			// Delete the error message
			if (errorMessage) {
				errorMessage.parentElement.removeChild(errorMessage);
			}
		});
	});
}
