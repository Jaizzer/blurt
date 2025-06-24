const createPostForm = document.querySelector(".createPostForm");
const postButton = document.querySelector(".postButton");
	console.log(createPostForm, postButton);


if (createPostForm && postButton) {
	postButton.addEventListener("click", () => {
		createPostForm.submit();
	});
}
