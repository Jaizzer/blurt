const { Router } = require("express");
const authRouter = Router();
const authController = require("../controllers/authController.js");

authRouter.get("/signUp", authController.signUpGet);
authRouter.post("/signUp", authController.signUpPost);

module.exports = authRouter;
