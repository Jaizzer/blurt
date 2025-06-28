const postAdditionOptionsContainer = document.querySelector(
	".postAdditionOptionsContainer"
);
const header = postAdditionOptionsContainer.querySelector("h2");

const minimizeButton = document.createElement("button");
minimizeButton.classList.add("minimizeButton");
minimizeButton.type = "button";
minimizeButton.innerHTML = `
    <div class="iconContainer">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 11H18V13H6V11Z"/>
        </svg>
    </div>
`;
minimizeButton.addEventListener("click", minimizePostAdditionOptionsContainer);

// Insert the minimize button by default
postAdditionOptionsContainer.insertBefore(
	minimizeButton,
	header.nextElementSibling
);

const maximizeButton = document.createElement("button");
maximizeButton.classList.add("maximizeButton");
maximizeButton.innerHTML = `
    <div class="iconContainer">
        <svg width="800px" height="800px" viewBox="-0.5 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.5 4.25H6.5C5.43913 4.25 4.42178 4.67142 3.67163 5.42157C2.92149 6.17172 2.5 7.18913 2.5 8.25V18.25C2.5 19.3109 2.92149 20.3283 3.67163 21.0784C4.42178 21.8286 5.43913 22.25 6.5 22.25H16.5C17.5609 22.25 18.5783 21.8286 19.3284 21.0784C20.0786 20.3283 20.5 19.3109 20.5 18.25V13.25" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M11.4297 13.38L20.9197 3.89001" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M15.7891 3.25H19.499C20.0295 3.25 20.5382 3.46074 20.9133 3.83582C21.2883 4.21089 21.499 4.71957 21.499 5.25V8.96002" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </div>
`;
maximizeButton.type = "button";
maximizeButton.addEventListener("click", maximizePostAdditionOptionsContainer);

function minimizePostAdditionOptionsContainer() {
	// Hide the "+" and option name
	const contentsToHide = Array.from(
		postAdditionOptionsContainer.querySelectorAll(
			"span:nth-child(2), h3, h2"
		)
	);
	for (const contentToHide of contentsToHide) {
		contentToHide.hidden = true;
	}

	// Add minimize class to the post addition options container
	postAdditionOptionsContainer.classList.add("minimized");

	// Replace the minimize button with the maximize button
	const minimizeButton = document.querySelector(".minimizeButton");
	postAdditionOptionsContainer.replaceChild(maximizeButton, minimizeButton);
}

function maximizePostAdditionOptionsContainer() {
	// Show the "+" and option name
	const hiddenContents = Array.from(
		postAdditionOptionsContainer.querySelectorAll(
			"span:nth-child(2), h3, h2"
		)
	);
	for (const hiddenContent of hiddenContents) {
		hiddenContent.hidden = false;
	}

	// Remove the minimize class to the post addition options container
	postAdditionOptionsContainer.classList.remove("minimized");

	// Replace the maximize button with the minimize button
	const maximizeButton = document.querySelector(".maximizeButton");
	postAdditionOptionsContainer.replaceChild(minimizeButton, maximizeButton);
}
