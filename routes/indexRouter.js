const { Router } = require("express");

const indexRouter = Router();

indexRouter.get("/", (req, res, next) => {
  res.render("index", { title: "Express" });
});

module.exports = indexRouter;
