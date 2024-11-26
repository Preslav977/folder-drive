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
  const { id } = req.params;

  const getParentFolder = await prisma.folder.findFirst({
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
    subfolders: getParentFolder,
  });
});

exports.folder_create_get = asyncHandler(async (req, res, next) => {
  const getAllFolders = await prisma.folder.findMany();

  if (getAllFolders.length === 0) {
    res.send("No folders have been found");
  } else {
    res.render("create-folder");
  }
});

exports.folder_create_post = [
  validateFolder,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const { name } = req.body;

    if (!errors.isEmpty()) {
      return res.status(400).send(errors.array());
    } else {
      const createParentFolder = await prisma.folder.create({
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
