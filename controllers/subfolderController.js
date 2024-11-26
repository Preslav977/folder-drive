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

exports.subfolder_share_get = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const getParentFolder = await prisma.folder.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      children: true,
    },
  });

  res.render("share-folder", {
    subfolders: getParentFolder,
  });
});

exports.subfolder_share_post = [
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const generateSharedLink = uuidv4(id);

    const { sharedLinkDuration } = req.body;

    console.log(+sharedLinkDuration);

    const calculateLinkDuration = new Date().getTime() + +sharedLinkDuration;

    console.log(calculateLinkDuration);

    const formatDateToUTC = new Date(calculateLinkDuration).toISOString();

    console.log(formatDateToUTC);

    // const shareFolder = await prisma.folder.update({
    //   where: {
    //     id: Number(id),
    //   },
    //   data: {
    //     sharedLink: generateSharedLink,
    //     expiresAt: formatNewDateUTC,
    //   },
    // });
    // console.log(shareFolder);

    res.redirect(`/folders/${id}`);
  }),
];

exports.subfolder_shared_details = asyncHandler(async (req, res, next) => {
  const { sharedLink } = req.params;

  const newDate = new Date().getTime();

  const formatNewDate = new Date(newDate).toISOString();

  const findSharedFolder = await prisma.folder.findFirst({
    where: {
      sharedLink: sharedLink,
    },
    include: {
      children: true,
      file: true,
    },
  });

  if (formatNewDate > new Date(findSharedFolder.expiresAt).toISOString()) {
    res.status(404).send("Generated link expired");
  } else {
    res.render("index", {
      folders: findSharedFolder,
    });
  }
});
