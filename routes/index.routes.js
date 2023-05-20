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
  try {
    const salt = await bcryptjs.genSalt(12);
    const hash = await bcryptjs.hash(req.body.password, salt);
    // const user = await User({
    //   email: req.body.email, 
    //   password: hash, 
    // });
    // await user.save();


    const user = await User({
      email: req.body.email, 
      password: hash, 
    });
    await user.save();

    await User.findOne({ email: req.body.email });
    
    req.session.user = {
      id: user._id, 
      email: user.email,
    };
   
    // Log in the user immediately after registration
    
    req.session.user = user;
    console.log( req.session.user._id );
   
    res.redirect("/auth/profile");

  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(500).render('index', { errorMessageRegister: error.message });
    } else if (error.code === 11000) {
      res.status(500).render('index', {
        errorMessageRegister: 'The email is already used - want to log in?'
      });
    } else {
      next(error);
    }
  }
});

module.exports = router;