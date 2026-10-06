const express = require("express");
const { uploadResource, deleteResource } = require("../controllers/resourceController");
const resourcesRouter = express.Router();

resourcesRouter.post("/upload", uploadResource);
resourcesRouter.get("/:id", deleteResource);

exports.resourcesRouter = resourcesRouter;
