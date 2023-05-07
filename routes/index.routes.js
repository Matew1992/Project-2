const mongoose = require('mongoose');
const User = require("../models/User.model");
const express = require('express');
const router = express.Router();
const bcryptjs = require("bcryptjs");

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
  res.render("auth/profile");
});

router.post("/register", async (req, res,) => {
  console.log(req.body);

  const salt = await bcryptjs.genSalt(12);
  const hash = await bcryptjs.hash(req.body.password, salt);
  const user = new User({ email: req.body.email, password: hash });
  await user.save();
  // change this to be redicted somewhere instead of this message 
  // res.send("signed up");
  res.render("auth/profile");
  console.log(hash);
  console.log(user);
});

module.exports = router;
