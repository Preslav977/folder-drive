const { body } = require("express-validator");

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const folderLengthErr = "must be between 1 and 30 characters.";

const folderNameTaken = "is already taken.";

const folderMatchErr = "must match only letters, numbers, dashes.";

validateFolder = [
  body("name")
    .custom(async (value) => {
      const folderNameExists = await prisma.folder.findUnique({
        where: {
          name: value,
        },
      });

      if (folderNameExists) {
        throw new Error(`Folder name ${folderNameTaken}`);
      }
    })
    .trim()
    .isLength({ min: 1, max: 30 })
    .escape()
    .withMessage(`Folder name ${folderLengthErr}`)
    .matches(/^[a-zA-Z0-9_ ]*$/)
    .withMessage(`Folder name ${folderMatchErr}`),
];

module.exports = validateFolder;
