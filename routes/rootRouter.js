const { Router } = require("express");
const rootRouter = Router();
const rootControllers = require("../controllers/rootControllers");
const rootMiddlewares = require("../middlewares/rootMiddlewares.js");
const rootValidators = require("../validators/rootValidators.js");
const authMiddlewares = require("../middlewares/authMiddlewares.js");

rootRouter.get("/", authMiddlewares.isAuthenticated, rootControllers.rootGet);
rootRouter.get(
	"/pickUsername",
	authMiddlewares.isAuthenticated,
	rootControllers.pickUsernameGet
);
rootRouter.post(
	"/pickUsername",
	authMiddlewares.isAuthenticated,
	rootValidators.pickUsername,
	rootMiddlewares.validatePickUsernameForm,
	rootControllers.pickUsernamePost
);

module.exports = rootRouter;
