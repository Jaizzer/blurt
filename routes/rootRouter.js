const { Router } = require("express");
const rootRouter = Router();
const rootControllers = require("../controllers/rootController");

rootRouter.get("/", rootControllers.rootGet);

module.exports = rootRouter;
