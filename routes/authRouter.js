const { Router } = require("express");
const authRouter = Router();
const authController = require("../controllers/authController.js");

authRouter.get("/", authController.signUpGet);
authRouter.post("/", authController.signUpPost);

module.exports = authRouter;
