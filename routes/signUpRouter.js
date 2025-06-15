const { Router } = require("express");
const signUpRouter = Router();
const signUpControllers = require("../controllers/signUpController.js");

signUpRouter.get("/", signUpControllers.signUpGet);
signUpRouter.post("/", signUpControllers.signUpPost);

module.exports = signUpRouter;
