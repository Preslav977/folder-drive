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
