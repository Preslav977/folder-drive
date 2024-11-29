const { validationResult } = require("express-validator");

const bcrypt = require("bcryptjs");

const asyncHandler = require("express-async-handler");

const validateUser = require("../middlewares/validateUser");

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.user_sign_up_get = asyncHandler(async (req, res, next) => {
  res.render("sign-up");
});

exports.user_sign_up_post = [
  validateUser,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const { username, password, confirm_password } = req.body;

    bcrypt.hash(password, 10, async (err, hashedPassword) => {
      if (err) {
        console.error("Failed to hash the passwords", err);
        throw err;
      }
      if (!errors.isEmpty()) {
        res.render("sign-up", {
          errors: errors.array(),
          userName: username,
          userPassword: password,
          userConfirmPassword: confirm_password,
        });
      } else {
        const createUser = await prisma.user.create({
          data: {
            username: username,
            password: hashedPassword,
            confirm_password: hashedPassword,
          },
        });

        res.redirect("/");
      }
    });
  }),
];

exports.user_log_in_get = asyncHandler(async (req, res, next) => {
  res.render("log-in");
});
