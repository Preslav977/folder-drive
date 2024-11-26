const asyncHandler = require("express-async-handler");

const validateFolder = require("../middlewares/validateFolder");

const { PrismaClient } = require("@prisma/client");

const { validationResult } = require("express-validator");

const prisma = new PrismaClient();

const { v4: uuidv4 } = require("uuid");

exports.subfolder_create_get = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const getParentFolder = await prisma.folder.findUnique({
    where: {
      id: Number(id),
    },
  });

  // console.log(getParentFolder);

  res.render("create-subfolder", {
    folder: getParentFolder,
  });
});

exports.subfolder_create_post = [
  validateFolder,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const { id } = req.params;

    const { name } = req.body;

    if (!errors.isEmpty()) {
      res.status(400).send(errors.array());
    } else {
      const createNestedFolder = await prisma.folder.create({
        data: {
          name: name,
          size: "--",
          createdAt: new Date(),
          userId: req.user.id,
          parentId: Number(id),
        },
      });

      console.log(createNestedFolder);

      res.redirect(`/folders/${id}`);
    }
  }),
];

exports.subfolder_delete_get = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // console.log(id);

  const getParentFolder = await prisma.folder.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      children: true,
    },
  });

  // console.log(getParentFolder);
});

exports.subfolder_delete_post = [
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    // console.log(id);

    const deleteFolderWithItsContent = await prisma.folder.delete({
      where: {
        id: Number(id),
      },
    });

    // console.log(deleteFolderWithItsContent);

    res.redirect("/folders/");
  }),
];
