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
