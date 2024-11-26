const { Router } = require("express");

const folderRouter = Router();

const folderController = require("../controllers/folderController");

folderRouter.get("/create", folderController.folder_create_get);

folderRouter.post("/create", folderController.folder_create_post);

folderRouter.get("/:id", folderController.folder_details);

folderRouter.get("/", folderController.folders_get);

module.exports = folderRouter;
