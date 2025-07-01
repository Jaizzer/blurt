const { Router } = require("express");
const userRouter = Router();
const authMiddlewares = require("../middlewares/authMiddlewares.js");
const userControllers = require("../controllers/userControllers.js");
const userValidators = require("../validators/userValidators.js");
const userMiddlewares = require("../middlewares/userMiddlewares.js");
const fileUpload = require("../config/multer.js");

userRouter.get(
	"/update-profile-picture",
	authMiddlewares.isAuthenticated,
	userControllers.renderUpdateProfilePicturePage
);

userRouter.post(
	"/update-profile-picture",
	authMiddlewares.isAuthenticated,
	fileUpload.single("profilePicture"),
	userValidators.updateProfilePicture,
	userMiddlewares.validateUpdateProfilePictureForm,
	userControllers.updateProfilePicture
);

module.exports = userRouter;
