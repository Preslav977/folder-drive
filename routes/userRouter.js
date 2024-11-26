const { Router } = require("express");

const userRouter = Router();

const userController = require("../controllers/userController");

userRouter.get("/sign-up", userController.user_sign_up_get);

userRouter.post("/sign-up", userController.user_sign_up_post);

userRouter.get("/log-in", userController.user_log_in_get);

module.exports = userRouter;
