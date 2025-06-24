const { Router } = require("express");
const postRouter = Router();
const authMiddlewares = require("../middlewares/authMiddlewares.js");
const postControllers = require("../controllers/postControllers.js");
const postValidators = require("../validators/postValidators.js");
const postMiddlewares = require("../middlewares/postMiddlewares.js");
const fileUpload = require("../config/multer.js");

postRouter.get(
	"/create",
	authMiddlewares.isAuthenticated,
	postControllers.renderCreatePostPage
);

postRouter.post(
	"/create",
	authMiddlewares.isAuthenticated,
	fileUpload.array("mediaUploads"),
	postValidators.createPost,
	postMiddlewares.validateCreatePostForm,
	postControllers.createPost
);

module.exports = postRouter;
