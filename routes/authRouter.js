const { Router } = require("express");
const authRouter = Router();
const authControllers = require("../controllers/authControllers.js");
const authValidators = require("../validators/authValidators.js");
const authMiddlewares = require("../middlewares/authMiddlewares.js");

authRouter.get(
	"/sign-up",
	authMiddlewares.isUnauthenticated,
	authControllers.signUpGet
);
authRouter.post(
	"/sign-up",
	authValidators.signUp,
	authMiddlewares.validateSignUpForm,
	authControllers.signUpPost
);
authRouter.get(
	"/sign-in",
	authMiddlewares.isUnauthenticated,
	authControllers.signInGet
);
authRouter.post(
	"/sign-in",
	authValidators.signIn,
	authMiddlewares.validateSignInForm,
	authControllers.signInPost
);
authRouter.get(
	"/verify/:emailVerificationString",
	authMiddlewares.isUnauthenticated,
	authControllers.verifyUser
);
authRouter.get(
	"/sign-out",
	authMiddlewares.isAuthenticated,
	authControllers.signOut
);
authRouter.get(
	"/resend-verification-link",
	authMiddlewares.isUnauthenticated,
	authControllers.renderResendVerificationLinkPage
);
authRouter.post(
	"/resend-verification-link",
	authValidators.resendVerificationLink,
	authMiddlewares.validateResendVerificationLinkForm,
	authControllers.resendVerificationLink
);
authRouter.get(
	"/google",
	authMiddlewares.isUnauthenticated,
	authControllers.initializeSignInWithGoogle
);
authRouter.get(
	"/google/callback",
	authMiddlewares.isUnauthenticated,
	authControllers.signInWithGoogle
);
authRouter.get(
	"/github",
	authMiddlewares.isUnauthenticated,
	authControllers.initializeSignInWithGithub
);
authRouter.get(
	"/github/callback",
	authMiddlewares.isUnauthenticated,
	authControllers.signInWithGithub
);

module.exports = authRouter;
