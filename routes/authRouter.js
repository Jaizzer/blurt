const { Router } = require("express");
const authRouter = Router();
const authControllers = require("../controllers/authControllers.js");
const authValidators = require("../validators/authValidators.js");
const authMiddlewares = require("../middlewares/authMiddlewares.js");

authRouter.get("/signUp", authControllers.signUpGet);
authRouter.post(
	"/signUp",
	authValidators.signUp,
	authMiddlewares.validateSignUpForm,
	authControllers.signUpPost
);
authRouter.get("/signIn", authControllers.signInGet);
authRouter.post(
	"/signIn",
	authValidators.signIn,
	authMiddlewares.validateSignInForm,
	authControllers.signInPost
);
authRouter.get("/verify/:emailVerificationString", authControllers.verifyUser);
authRouter.get(
	"/signOut",
	authMiddlewares.isAuthenticated,
	authControllers.signOut
);
authRouter.get(
	"/resendVerificationLink",
	authControllers.renderResendVerificationLinkPage
);
authRouter.post(
	"/resendVerificationLink",
	authValidators.resendVerificationLink,
	authMiddlewares.validateResendVerificationLinkForm,
	authControllers.resendVerificationLink
);
authRouter.get("/google", authControllers.initializeSignInWithGoogle);
authRouter.get("/google/callback", authControllers.signInWithGoogle);
authRouter.get("/github", authControllers.initializeSignInWithGithub);
authRouter.get("/github/callback", authControllers.signInWithGithub);

module.exports = authRouter;
