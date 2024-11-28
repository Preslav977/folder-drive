const asyncHandler = require("express-async-handler");

const validateFolder = require("../middlewares/validateFolder");

const { PrismaClient } = require("@prisma/client");

const { validationResult } = require("express-validator");

const prisma = new PrismaClient();

const { v4: uuidv4 } = require("uuid");

exports.subfolder_create_get = asyncHandler(async (req, res, next) => {
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

  console.log(getParentFolder);

  res.render("partials/create-subfolder", {
    subfolders: getParentFolder,
  });
});

exports.subfolder_create_post = [
  validateFolder,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const { id } = req.params;

    const { name } = req.body;

    const getParentFolder = await prisma.folder.findFirst({
      where: {
        id: Number(id),
      },
      include: {
        children: true,
        file: true,
      },
    });

    if (!errors.isEmpty()) {
      console.log(errors.array());
      res.render("partials/create-subfolder", {
        subfolders: getParentFolder,
        folderName: name,
        errors: errors.array(),
      });
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
      // console.log(createNestedFolder);
      res.redirect(`/folders/${id}`);
    }
  }),
];

exports.subfolder_delete_get = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // console.log(id);

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

  res.render("partials/delete-folder", {
    subfolders: getParentFolder,
  });
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

    res.redirect("/folders");
  }),
];

exports.subfolder_share_get = asyncHandler(async (req, res, next) => {
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

  res.render("partials/share-folder", {
    subfolders: getParentFolder,
  });
});

exports.subfolder_share_post = [
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const generateSharedLink =
      `http://localhost:5000/folders/shared/${id}` + uuidv4(id);

    console.log(generateSharedLink);

    const { sharedLinkDuration } = req.body;

    console.log(+sharedLinkDuration);

    const calculateLinkDuration = new Date().getTime() + +sharedLinkDuration;

    console.log(calculateLinkDuration);

    const formatDateToUTC = new Date(calculateLinkDuration).toISOString();

    console.log(formatDateToUTC);

    const shareFolder = await prisma.folder.update({
      where: {
        id: Number(id),
      },
      data: {
        sharedLink: generateSharedLink,
        expiresAt: formatDateToUTC,
      },
    });
    // console.log(shareFolder);

    // res.send(shareFolder);

    res.redirect(`/folders/share/${id}`);
  }),
];

exports.subfolder_shared_details = asyncHandler(async (req, res, next) => {
  const { sharedLink } = req.params;

  const concatSharedLink = `http://localhost:5000/folders/shared/${sharedLink}`;

  // console.log(concatSharedLink);

  const newDate = new Date().getTime();

  const formatNewDate = new Date(newDate).toISOString();

  const findSharedFolder = await prisma.folder.findFirst({
    where: {
      sharedLink: concatSharedLink,
    },
    include: {
      children: true,
      file: true,
    },
  });

  // console.log(findSharedFolder);

  if (formatNewDate > new Date(findSharedFolder.expiresAt).toISOString()) {
    res.status(404).send("Generated link expired");
  } else {
    res.render("index", {
      subfolders: findSharedFolder,
    });
  }
});
