const { Router } = require("express");

const folderRouter = Router();

const folderController = require("../controllers/folderController");

const subfolderController = require("../controllers/subfolderController");

const fileController = require("../controllers/fileController");

folderRouter.get("/create", folderController.folder_create_get);

folderRouter.post("/create", folderController.folder_create_post);

folderRouter.get("/create/:id", subfolderController.subfolder_create_get);

folderRouter.post("/create/:id", subfolderController.subfolder_create_post);

folderRouter.get("/upload/:id", fileController.file_upload_file_get);

folderRouter.post("/upload/:id", fileController.file_upload_file_post);

folderRouter.post(
  "/:id/download/:fileId",
  fileController.file_download_file_post
);

folderRouter.get("/delete/:id", subfolderController.subfolder_delete_get);

folderRouter.post("/delete/:id", subfolderController.subfolder_delete_post);

folderRouter.post("/:id/delete/:fileId", fileController.file_delete_post);

folderRouter.get("/share/:id", subfolderController.subfolder_share_get);

folderRouter.post("/share/:id", subfolderController.subfolder_share_post);

folderRouter.get("/:id", folderController.folder_details);

folderRouter.get("/:id/file/:fileId", fileController.file_details_get);

folderRouter.get(
  "/public/:sharedLink",
  subfolderController.subfolder_shared_folders
);

folderRouter.get(
  "/public/:sharedLink/:id",
  subfolderController.subfolder_shared_details
);

folderRouter.get("/", folderController.folders_get);

module.exports = folderRouter;
