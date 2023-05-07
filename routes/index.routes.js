const express = require('express');
const router = express.Router();

const authRoutes = require("./auth.routes");
router.use("/auth", authRoutes);

router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/login", (req, res, next) => {
  res.render("auth/profile");
});

router.post("/login", (req, res, next) => {
  res.render("auth/profile");
});

router.get("/home", (req, res, next) => {
  res.render("auth/home");
});

router.get("/register", (req, res, next) => {
  res.render("auth/register");
});

router.post("/register", (req, res, next) => {
  res.render("auth/register");
});

module.exports = router;
