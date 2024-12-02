const { validationResult } = require("express-validator");

const asyncHandler = require("express-async-handler");

const validateFolder = require("../middlewares/validateFolder");

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.folders_get = asyncHandler(async (req, res, next) => {
  const getAllFolders = await prisma.folder.findMany();

  // console.log(getAllFolders);

  res.render("index", {
    folders: getAllFolders,
  });
});

exports.folder_details = asyncHandler(async (req, res, next) => {
  const getAllFolders = await prisma.folder.findMany();

  const { id } = req.params;

  const getFolderDetails = await prisma.folder.findFirst({
    where: {
      id: Number(id),
    },
    include: {
      children: true,
      file: true,
    },
  });

  // console.log(getParentFolder);

  res.render("index", {
    subfolders: getFolderDetails,
    folders: getAllFolders,
  });
});

exports.folder_create_get = asyncHandler(async (req, res, next) => {
  const getAllFolders = await prisma.folder.findMany();

  res.render("partials/create-folder", {
    folders: getAllFolders,
  });
});

exports.folder_create_post = [
  validateFolder,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const { name } = req.body;

    if (!errors.isEmpty()) {
      res.render("partials/create-folder", {
        folderName: name,
        errors: errors.array(),
      });
    } else {
      const createFolder = await prisma.folder.create({
        data: {
          name: name,
          size: "--",
          createdAt: new Date(),
          userId: req.user.id,
        },
      });

      // console.log(createParentFolder);

      res.redirect("/folders");
    }
  }),
];
