const addFeelingOptionButton = document.querySelector("#addFeelingOption");
const feelingSelectInput = document.querySelector("select");
const userBadge = document.querySelector(".userBadge");

// Retrieve all feelings
const feelingOptions = Array.from(
	document.querySelectorAll("#feeling > option")
)
	// Filter out the place holder option
	.filter((feeling) => feeling.value);

// Filter out the feelings
const feelings = feelingOptions.map((feelingOption) => ({
	id: feelingOption.dataset.id,
	name: feelingOption.dataset.name,
	emoji: feelingOption.dataset.emoji,
}));

// Create feeling badge if the select input already has a value
if (feelingSelectInput.value) {
	console.log(feelingSelectInput.value);
	const feeling = feelings.filter(
		(feeling) => feeling.id == feelingSelectInput.value
	)[0];
	const feelingBadge = createFeelingBadge(feeling);

	// Put the new feeling badge below the user badge
	userBadge.appendChild(feelingBadge);
}

addFeelingOptionButton.addEventListener("click", () => {
	const feelingSelectionContainer = document.querySelector(
		".feelingSelectionContainer"
	);

	// Create a feeling selection container if it does not exist
	if (!feelingSelectionContainer) {
		const form = document.querySelector("form");
		form.parentElement.insertBefore(
			createFeelingSelectionContainer(),
			form.nextElementSibling
		);
	}
});

function createFeelingSelectionContainer() {
	// Create the feeling selection container
	const feelingSelectionContainer = document.createElement("div");
	feelingSelectionContainer.classList.add("feelingSelectionContainer");

	// Create close button
	const closeButton = document.createElement("button");
	closeButton.innerHTML = `  
        <div class="iconContainer">
            <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z" fill="#0F1729" />
            </svg>
        </div>
    `;
	closeButton.addEventListener("click", () => {
		feelingSelectionContainer.parentElement.removeChild(
			feelingSelectionContainer
		);
	});
	feelingSelectionContainer.appendChild(closeButton);

	// Create the feeling selection
	const feelingSelection = document.createElement("ul");
	feelingSelection.classList.add("feelingSelection");
	feelingSelectionContainer.appendChild(feelingSelection);

	// Create feeling list items
	feelings.forEach((feeling) => {
		const listItem = document.createElement("li");

		// Create the feeling button
		const chooseFeelingButton = document.createElement("button");
		chooseFeelingButton.textContent = `${feeling.name} ${feeling.emoji}`;
		chooseFeelingButton.addEventListener("click", () => {
			// Update the selected feeling
			feelingSelectInput.value = feeling.id;

			// Create new feeling badge
			const feelingBadge = createFeelingBadge(feeling);

			// Delete previous feeling badge
			const previousFeelingBadge =
				document.querySelector(".feelingBadge");
			if (previousFeelingBadge) {
				previousFeelingBadge.parentElement.removeChild(
					previousFeelingBadge
				);
			}

			// Put the new feeling badge below the user badge
			userBadge.appendChild(feelingBadge);

			// Close the feeling selection container
			feelingSelectionContainer.parentElement.removeChild(
				feelingSelectionContainer
			);
		});

		// Add the button to the feeling selection
		listItem.appendChild(chooseFeelingButton);
		feelingSelection.appendChild(listItem);
	});

	return feelingSelectionContainer;
}

function createFeelingBadge(feeling) {
	const feelingBadge = document.createElement("div");
	feelingBadge.classList.add("feelingBadge");

	// Create content
	const content = document.createElement("p");
	content.textContent = `is feeling ${feeling.name} ${feeling.emoji}`;
	feelingBadge.appendChild(content);

	// Create delete feeling badge button
	const deleteFeelingBadgeButton = document.createElement("button");
	deleteFeelingBadgeButton.classList.add("deleteFeelingBadgeButton");
	deleteFeelingBadgeButton.innerHTML = `  
        <div class="iconContainer">
            <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z" fill="#0F1729" />
            </svg>
        </div>
    `;
	deleteFeelingBadgeButton.addEventListener("click", () => {
		// Remove feeling badge from the HTML
		feelingBadge.parentElement.removeChild(feelingBadge);

		// Update feeling select element's value
		feelingSelectInput.value = null;
	});
	feelingBadge.appendChild(deleteFeelingBadgeButton);

	return feelingBadge;
}
