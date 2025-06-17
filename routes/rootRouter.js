const { Router } = require("express");
const rootRouter = Router();
const rootControllers = require("../controllers/rootControllers");
const authMiddlewares = require("../middlewares/authMiddlewares.js");

rootRouter.get("/", authMiddlewares.isAuthenticated, rootControllers.rootGet);

module.exports = rootRouter;
