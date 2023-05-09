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

router.get("/register", (req, res, next) => {
  res.render("register");
});

router.post("/register", async (req, res,) => {
  console.log(req.body);

  const salt = await bcryptjs.genSalt(12);
  const hash = await bcryptjs.hash(req.body.password, salt);
//  const user = new User({ email: req.body.email, password: hash });
  const user = new User({ 
      email: req.body.email, 
      password: hash, 
      // name: req.body.name,     
      // location: req.body.location, 
      // company: req.body.company, 
      // hiring: req.body.hiring,
      // position: req.body.position
    });
  await user.save();
  // change this to be redicted somewhere instead of this message 
  // res.send("signed up");
  res.render("auth/profile");
  console.log(hash);
  console.log(user);
});

module.exports = router;
