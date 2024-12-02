const asyncHandler = require("express-async-handler");

const { validationResult } = require("express-validator");

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const cloudinary = require("cloudinary").v2;

const upload = require("../middlewares/multer");

const validateFile = require("../middlewares/validateFile");

const formatFileSize = require("../helper/formatFileSize");

exports.file_details_get = asyncHandler(async (req, res, next) => {
  const { id, fileId } = req.params;

  const fileDetails = await prisma.file.findUnique({
    where: {
      id: Number(fileId),
    },
    include: {
      folder: Number(id),
    },
  });
  // console.log(fileDetails);

  res.render("partials/file-details", {
    file: fileDetails,
  });
});

exports.file_upload_file_get = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const getParentFolder = await prisma.folder.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      children: true,
      file: true,
    },
  });

  // console.log(getParentFolder);

  res.render("partials/upload-file", {
    subfolders: getParentFolder,
  });
});

const multerUploadMiddleware = upload.single("uploaded_file");

async function handleFileUpload(file) {
  const response = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
    folder: "download",
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  });

  // console.log(response);
  return response;
}

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

let cloudinaryResponse;

exports.file_upload_file_post = [
  asyncHandler(async (req, res, next) => {
    await runMiddleware(req, res, multerUploadMiddleware);
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    cloudinaryResponse = await handleFileUpload(dataURI);
    // console.log(cloudinaryResponse);
    next();
  }),

  validateFile,
  async (req, res, next) => {
    const errors = validationResult(req);

    const { id } = req.params;

    const getParentFolder = await prisma.folder.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        children: true,
        file: true,
      },
    });

    if (!errors.isEmpty()) {
      res.render("partials/upload-file", {
        subfolders: getParentFolder,
        errors: errors.array(),
      });
    } else {
      const uploadFile = await prisma.file.create({
        data: {
          name: req.file.originalname,
          URL: cloudinaryResponse.secure_url,
          size: formatFileSize(req.file.size),
          createdAt: new Date(),
          userId: req.user.id,
          folderId: Number(id),
        },
      });

      // console.log(uploadFile);

      res.redirect(`/folders/${id}`);
    }
  },
];

exports.file_download_file_post = [
  asyncHandler(async (req, res, next) => {
    const { id, fileId } = req.params;

    const fileDetails = await prisma.file.findUnique({
      where: {
        id: Number(fileId),
      },
      include: {
        folder: Number(id),
      },
    });
    // console.log(fileDetails.URL);

    res.redirect(fileDetails.URL);
  }),
];

exports.file_delete_post = [
  asyncHandler(async (req, res, next) => {
    const { id, fileId } = req.params;

    const fileDetails = await prisma.file.delete({
      where: {
        id: Number(fileId),
      },
      include: {
        folder: Number(id),
      },
    });

    res.redirect(`/folders/${id}`);
  }),
];

// exports.file_share_get = asyncHandler(async (req, res, next) => {});

// exports.file_share_post = [];
