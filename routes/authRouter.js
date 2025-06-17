const { Router } = require("express");
const authRouter = Router();
const authController = require("../controllers/authController.js");
const authValidators = require("../validators/authValidators.js");
const authMiddlewares = require("../middlewares/authMiddlewares.js");

authRouter.get("/signUp", authController.signUpGet);
authRouter.post("/signUp", authValidators.signUp, authMiddlewares.validateSignUpForm, authController.signUpPost);
authRouter.get("/signIn", authController.signInGet);
authRouter.post("/signIn", authValidators.signIn, authMiddlewares.validateSignInForm, authController.signInPost);

module.exports = authRouter;
