const { Router } = require("express");
const authRouter = Router();
const authController = require("../controllers/authController.js");

authRouter.get("/signUp", authController.signUpGet);
authRouter.post("/signUp", authController.signUpPost);
authRouter.get("/signIn", authController.signInGet);

module.exports = authRouter;
