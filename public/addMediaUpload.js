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
		// Create list item
		const listItem = document.createElement("li");
		if (isValidFileType(mediaUpload)) {
			// Create the media upload preview image
			const mediaUploadPreview = document.createElement("img");
			mediaUploadPreview.src = URL.createObjectURL(mediaUpload);
			mediaUploadPreview.alt = mediaUploadPreview.title =
				mediaUpload.name;

			// Put the image inside the list item
			listItem.appendChild(mediaUploadPreview);

			list.appendChild(listItem);
		} else {
			// Clear the media uploads' preview
			clearElement(mediaUploadsPreview);

			// Create error message if the media upload is not a valid file
			const isThereAlreadyAnErrorMessage =
				mediaUploadsPreview.querySelector(".errorMessage");
			if (!isThereAlreadyAnErrorMessage) {
				const errorMessage = document.createElement("p");
				errorMessage.textContent = `Invalid file type found. Update your selection.`;
				mediaUploadsPreview.appendChild(errorMessage);
			}

			// Break loop
			break;
		}
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
