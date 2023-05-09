const mongoose = require('mongoose');
const router = require("express").Router();
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard.js");

const User = require("../models/User.model");
const bcryptjs = require("bcryptjs");

require("../db");

router.get("/login", isLoggedOut, (req, res, next) => {
  res.render("index");
});

router.post("/login", async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.render("index", { error: "user non-exist" });
    }
    const passwordMatch = await bcryptjs.compare(
      req.body.password,
      user.password
    );
    if (!passwordMatch) {
      return res.render("index", { error: "password is incorrect" });
    }

    // console.log(req.session);
    req.session.user = {
      email: user.email,
    };

    res.redirect("/auth/profile");
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.get("/home", isLoggedIn, (req, res, next) => {
  res.render("auth/home");
});

router.get("/home", isLoggedOut, (req, res, next) => {
    res.render("index");
  });

router.get("/post", isLoggedIn, (req, res, next) => {
  res.render("auth/post");
});

router.get("/post", isLoggedOut, (req, res, next) => {
  res.render("index");
});

router.get("/profile", isLoggedIn, (req, res, next) => {
  res.render("auth/profile");
});

router.get("/profile", isLoggedOut, (req, res, next) => {
  res.render("index");
});

router.post("/profile", isLoggedIn, (req, res, next) => {
    res.render("auth/profile");
  });

module.exports = router;
