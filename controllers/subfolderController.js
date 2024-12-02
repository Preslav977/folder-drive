const asyncHandler = require("express-async-handler");

const validateFolder = require("../middlewares/validateFolder");

const { PrismaClient } = require("@prisma/client");

const { validationResult } = require("express-validator");

const prisma = new PrismaClient();

const { v4: uuidv4 } = require("uuid");

exports.subfolder_create_get = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const getFolder = await prisma.folder.findFirst({
    where: {
      id: Number(id),
      userId: req.user.id,
    },
    include: {
      children: true,
      file: true,
    },
  });

  // console.log(getFolder);

  res.render("partials/create-subfolder", {
    subfolders: getFolder,
  });
});

exports.subfolder_create_post = [
  validateFolder,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const { id } = req.params;

    const { name } = req.body;

    const getFolder = await prisma.folder.findFirst({
      where: {
        id: Number(id),
        userId: req.user.id,
      },
      include: {
        children: true,
        file: true,
      },
    });

    if (!errors.isEmpty()) {
      res.render("partials/create-subfolder", {
        subfolders: getFolder,
        folderName: name,
        errors: errors.array(),
      });
    } else {
      const createSubfolder = await prisma.folder.create({
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

  const getFolder = await prisma.folder.findFirst({
    where: {
      id: Number(id),
      userId: req.user.id,
    },
    include: {
      children: true,
      file: true,
    },
  });

  // console.log(getParentFolder);

  res.render("partials/delete-folder", {
    subfolders: getFolder,
  });
});

exports.subfolder_delete_post = [
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    // console.log(id);

    const deleteSubfolderWithChildren = await prisma.folder.delete({
      where: {
        id: Number(id),
        userId: req.user.id,
      },
    });

    // console.log(deleteFolderWithItsContent);

    res.redirect("/folders");
  }),
];

exports.subfolder_share_get = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const getFolder = await prisma.folder.findFirst({
    where: {
      id: Number(id),
      userId: req.user.id,
    },
    include: {
      children: true,
      file: true,
    },
  });

  res.render("partials/share-folder", {
    subfolders: getFolder,
  });
});

exports.subfolder_share_post = [
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const generateSharedLink = uuidv4(id);

    // console.log(generateSharedLink);

    const { sharedLinkDuration } = req.body;

    // console.log(+sharedLinkDuration);

    const calculateLinkDuration = new Date().getTime() + +sharedLinkDuration;

    // console.log(calculateLinkDuration);

    const formatDateToUTC = new Date(calculateLinkDuration).toISOString();

    // console.log(formatDateToUTC);

    const shareFolder = await prisma.folder.update({
      where: {
        id: Number(id),
        userId: req.user.id,
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

exports.subfolder_shared_folders = asyncHandler(async (req, res, next) => {
  const { sharedLink } = req.params;

  // console.log(sharedLink);

  const getNewDate = new Date().getTime();

  const formatNewDateToUTC = new Date(getNewDate).toISOString();

  const findSharedFolder = await prisma.folder.findFirst({
    where: {
      sharedLink: sharedLink,
      userId: req.user.id,
    },
    include: {
      children: true,
      file: true,
    },
  });

  // console.log(findSharedFolder);

  if (formatNewDateToUTC > new Date(findSharedFolder.expiresAt).toISOString()) {
    res.status(404).send("Generated link expired");
  } else {
    res.render("index", {
      sharedFolder: findSharedFolder,
    });
  }
});

exports.subfolder_shared_details = asyncHandler(async (req, res, next) => {
  const { sharedLink, id } = req.params;

  // console.log(sharedLink, id);

  const getFolder = await prisma.folder.findFirst({
    where: {
      id: Number(id),
      sharedLink: sharedLink,
      userId: req.user.id,
    },
    include: {
      children: true,
      file: true,
    },
  });

  // console.log(getFolder);

  res.render("index", {
    sharedSubFolder: getFolder,
  });
});
