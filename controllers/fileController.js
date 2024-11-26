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

  res.render("index", {
    file: fileDetails,
  });
});

exports.file_upload_file_get = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const getParentFolder = await prisma.folder.findUnique({
    where: {
      id: Number(id),
    },
  });

  console.log(getParentFolder);

  res.render("file-upload", {
    subfolders: getParentFolder,
  });
});

const multerUploadMiddleware = upload.single("uploaded_file");

async function handleFileUpload(file) {
  const response = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
    folder: "download",
    unique_filename: true,
  });
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
    next();
  }),

  validateFile,
  async (req, res, next) => {
    const errors = validationResult(req);

    const { id } = req.params;

    if (!errors.isEmpty()) {
      res.status(400).send(errors.array());
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
      console.log(uploadFile);
    }
  },
];
