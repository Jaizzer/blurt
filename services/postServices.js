const Post = require("../models/postModel.js");
const storageServices = require("../services/storageServices.js");
const capitalize = require("../utils/capitalize.js");
const generateRandomString = require("../utils/generateRandomString.js");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

async function savePost({ description, mediaUploads, userId, feelingId }) {
	// Hash the filenames
	mediaUploads.forEach((mediaUpload) => {
		mediaUpload.fileName = generateRandomString();
	});

	// Same the media uploads to the cloud in-parallel
	await Promise.all(
		mediaUploads.map((mediaUpload) => {
			return storageServices.uploadFile({
				file: mediaUpload.file,
				fileName: mediaUpload.fileName,
				fileType: mediaUpload.fileType,
			});
		})
	);

	// Save the post to the database
	await Post.add({
		description: description,
		userId: userId,
		mediaUploads: mediaUploads?.map(
			(mediaUploads) => mediaUploads.fileName
		),
		feelingId: feelingId,
		dateUploaded: new Date(),
	});
}

async function getAllFeelings() {
	return (await Post.getAllFeelings()).map((feeling) => ({
		...feeling,
		name: capitalize(feeling.name),
	}));
}

async function getPost(id) {
	// Retrieve the post from the database
	const post = await Post.getPostById(id);

	if (!post) {
		return null;
	}

	// Attach the media url
	const media =
		post.media &&
		(await Promise.all(
			post?.media?.map((media) => {
				return storageServices.getFileUrl(media);
			})
		));

	// Attach uploader's profile picture url
	const user = {
		...post.user,
		profilePictureUrl: await getProfilePictureUrl(post.user.profilePicture),
	};

	// Attach post likers' profile picture url
	const likers =
		post.likers &&
		(await Promise.all(
			post.likers?.map(async (liker) => ({
				...liker,
				profilePictureUrl: await getProfilePictureUrl(
					liker.profilePicture
				),
			}))
		));

	// Attach the commenter's profile picture url
	const comments =
		post.comments &&
		(await Promise.all(
			post.comments?.map(async (comment) => {
				const user = {
					...comment.user,
					profilePictureUrl: await getProfilePictureUrl(
						comment.user.profilePicture
					),
				};
				const likers =
					comment.likers &&
					(await Promise.all(
						comment?.likers?.map(async (liker) => ({
							...liker,
							profilePictureUrl: await getProfilePictureUrl(
								liker.profilePicture
							),
						}))
					));
				return { ...comment, user: user, likers: likers };
			})
		));

	return { ...post, user, media, likers, comments };
}

async function getProfilePictureUrl(profilePictureName) {
	let filename =
		profilePictureName || process.env.DEFAULT_PROFILE_PICTURE_FILENAME;
	return await storageServices.getFileUrl(filename);
}

module.exports = {
	savePost,
	getAllFeelings,
	getPost,
};
