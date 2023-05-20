const express = require("express");
const mongoose = require("mongoose");
const router = require("express").Router();
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard.js");

const User = require("../models/User.model");
const bcryptjs = require("bcryptjs");

// Middleware to parse JSON data in the request body
router.use(express.json());

require("../db");

router.get("/login", isLoggedOut, (req, res, next) => {
  res.render("index");
});

router.post("/login", async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.render("index", { errorMessageEmail: "We cannot find the email." });
    }
    const passwordMatch = await bcryptjs.compare(
      req.body.password,
      user.password
    );
    if (!passwordMatch) {
      return res.render("index", { errorMessagePw: "Password is incorrect." });
    }

    req.session.user = {
      id: user._id, 
      email: user.email,
    };

    res.redirect("/auth/profile");
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.get("/home", isLoggedIn, async (req, res, next) => {
  try {
    const activePosts = await User.find({ hiring: "on" });
    res.render("auth/home", { activePosts });
    console.log({ activePosts });
  } catch (err) {
    console.log(err);
  }
});

router.get("/home", isLoggedOut, (req, res, next) => {
  res.render("index");
});

router.get("/post/:id", isLoggedIn, async (req, res, next) => {
  try {
    const onePost = await User.findById(req.params.id);
    console.log(onePost);
    res.render("auth/post", { onePost });
  } catch (err) {
    console.log(err);
  }
});

router.get("/post", isLoggedOut, (req, res, next) => {
  res.render("index");
});

router.get("/profile", isLoggedIn, async (req, res, next) => {
  const userId = req.session.user.id;
  console.log("this is the profile route",userId,req.session);
  const foundUser = await User.findById(userId).populate();
  res.render('auth/profile', { foundUser });  
});

router.get("/profile", isLoggedOut, (req, res, next) => {
  res.render("index");
});

router.post("/profile", isLoggedIn, async (req, res, next) => {
 
  const onePost = await User.findOneAndUpdate(
    { email: req.session.user.email },
    {
      name: req.body.Name,
      location: req.body.Location,
      company: req.body.Company,
      hiring: req.body.Hiring ? 'on' : 'off',
      position: req.body.Position,
    },
    { new: true }
  );
  // console.log(req.body);
  res.render("auth/post", { onePost });
});

router.get("/logout", isLoggedIn, (req, res, next) => {
  req.session.destroy();
  res.redirect("/home");
});

router.post("/search", isLoggedIn, async (req, res, next) => {
  try {
    const activePosts = await User.find({ location: req.body.searchLocation , hiring: "on" });

    
    if (activePosts.length===0){
      console.log("activePosts");
      res.render("auth/home", { activePosts, errorMessageNoPosts: "No jobs here yet :(" });
    } else{res.render("auth/home", { activePosts });}
    
  } 
  catch (errorMessage) {
    res.status(500).json({ errorMessage: 'An error occurred while searching for posts' });
  }

});

module.exports = router;
