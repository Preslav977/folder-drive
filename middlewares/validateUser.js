const { body } = require("express-validator");

const usernameLengthErr = "must be between 1 and 30 characters.";

const usernameTakenErr = "is already taken.";

const passwordLengthErr = "must be at least 8 characters";

const passwordsNotMatchErr = "must match.";

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const validateUser = [
  body("username")
    .custom(async (value) => {
      const usernameTaken = await prisma.user.findUnique({
        where: {
          username: value,
        },
      });

      if (usernameTaken) {
        throw new Error(`Username ${usernameTakenErr}`);
      }
    })
    .trim()
    .isLength({ min: 1, max: 30 })
    .escape()
    .withMessage(`Username ${usernameLengthErr}`),
  body("password")
    .trim()
    .isLength({ min: 8 })
    .escape()
    .withMessage(`Password ${passwordLengthErr}`),
  body("confirm_password")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage(`Passwords ${passwordsNotMatchErr}`),
];

module.exports = validateUser;
