const mediaUploadsPreview = document.querySelector(".mediaUploadsPreview");
const addMediaOptionButton = document.querySelector("#addMediaOption");
const mediaUploadsInput = document.querySelector(`#mediaUploads`);

addMediaOptionButton.addEventListener("click", triggerMediaUploadsInput);

mediaUploadsInput.addEventListener("change", updateImageDisplay);

function triggerMediaUploadsInput() {
	mediaUploadsInput.click();
}

function updateImageDisplay() {
	// Clear the previous media uploads' preview
	clearElement(mediaUploadsPreview);

	// Access the media uploads
	const mediaUploads = mediaUploadsInput.files;

	// Create the list containing all the media upload previews
	const list = document.createElement("ul");
	mediaUploadsPreview.appendChild(list);

	for (const mediaUpload of mediaUploads || []) {
		const isFileValid = isValidFileType(mediaUpload);

		// Create list item
		const listItem = document.createElement("li");

		// Create the media upload preview image
		let mediaUploadPreview;
		if (isFileValid) {
			mediaUploadPreview = document.createElement("img");
			mediaUploadPreview.src = URL.createObjectURL(mediaUpload);
			mediaUploadPreview.alt = mediaUploadPreview.title =
				mediaUpload.name;
		} else {
			// Create unknown file type icon
			mediaUploadPreview = document.createElement("div");
			mediaUploadPreview.classList.add("iconContainer");
			mediaUploadPreview.innerHTML = `
                <svg fill="#000000" width="24px" height="24px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" class="icon">
                    <path d="M854.6 288.7c6 6 9.4 14.1 9.4 22.6V928c0 17.7-14.3 32-32 32H192c-17.7 0-32-14.3-32-32V96c0-17.7 14.3-32 32-32h424.7c8.5 0 16.7 3.4 22.7 9.4l215.2 215.3zM790.2 326L602 137.8V326h188.2zM402 549c0 5.4 4.4 9.5 9.8 9.5h32.4c5.4 0 9.8-4.2 9.8-9.4 0-28.2 25.8-51.6 58-51.6s58 23.4 58 51.5c0 25.3-21 47.2-49.3 50.9-19.3 2.8-34.5 20.3-34.7 40.1v32c0 5.5 4.5 10 10 10h32c5.5 0 10-4.5 10-10v-12.2c0-6 4-11.5 9.7-13.3 44.6-14.4 75-54 74.3-98.9-.8-55.5-49.2-100.8-108.5-101.6-61.4-.7-111.5 45.6-111.5 103zm110 227a32 32 0 1 0 0-64 32 32 0 0 0 0 64z"/>
                </svg>
            `;

			// Display error message if the file is invalid
			const isThereAlreadyAnErrorMessage =
				mediaUploadsPreview.querySelector(".errorMessage");
			if (!isThereAlreadyAnErrorMessage) {
				const errorMessage = document.createElement("p");
				errorMessage.classList.add("errorMessage");
				errorMessage.textContent = `Invalid file type found. Update your selection.`;
				mediaUploadsPreview.appendChild(errorMessage);
			}
		}

		// Put the image inside the list item
		listItem.appendChild(mediaUploadPreview);

		list.appendChild(listItem);
	}
}

function clearElement(element) {
	// Clear the previous media uploads' preview
	while (element.firstChild) {
		element.removeChild(element.firstChild);
	}
}

function isValidFileType(file) {
	const fileTypes = [
		"image/apng",
		"image/bmp",
		"image/gif",
		"image/jpeg",
		"image/pjpeg",
		"image/png",
		"image/svg+xml",
		"image/tiff",
		"image/webp",
		"image/x-icon",
	];

	return fileTypes.includes(file.type);
}
