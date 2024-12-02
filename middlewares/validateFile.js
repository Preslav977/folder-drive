const { check } = require("express-validator");

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const formatFileSize = require("../helper/formatFileSize");

const fileNameTaken = "is already taken";

const fileSizeExceedLimit = "size exceed limit";

validateFile = [
  check("uploaded_file").custom(async (value, { req }) => {
    const fileUploadSize = formatFileSize(req.file.size);

    console.log(fileUploadSize);

    if (fileUploadSize > "5 MB") {
      throw new Error(`File ${fileSizeExceedLimit}`);
    }

    const fileExists = await prisma.file.findFirst({
      where: {
        name: req.file.originalname,
      },
    });
    if (fileExists) {
      throw new Error(`File name ${fileNameTaken}`);
    }
  }),
];

module.exports = validateFile;
