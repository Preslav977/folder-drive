const { Router } = require("express");

const folderRouter = Router();

const folderController = require("../controllers/folderController");

const subfolderController = require("../controllers/subfolderController");

folderRouter.get("/create", folderController.folder_create_get);

folderRouter.post("/create", folderController.folder_create_post);

folderRouter.get("/create/:id", subfolderController.subfolder_create_get);

folderRouter.post("/create/:id", subfolderController.subfolder_create_post);

folderRouter.get("/delete/:id", subfolderController.subfolder_delete_get);

folderRouter.post("/delete/:id", subfolderController.subfolder_delete_post);

folderRouter.get("/share/:id", subfolderController.subfolder_share_get);

folderRouter.post("/share/:id", subfolderController.subfolder_share_post);

folderRouter.get("/:id", folderController.folder_details);

folderRouter.get("/", folderController.folders_get);

module.exports = folderRouter;
