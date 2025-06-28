const createPostForm = document.querySelector(".createPostForm");
const postButton = document.querySelector(".postButton");
	console.log(createPostForm, postButton);


if (createPostForm && postButton) {
	postButton.addEventListener("click", () => {
        // Disable button prevent resubmissions
        postButton.disabled = true;

        // Submit the form
		createPostForm.submit();
	});
}
