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

router.get("/home", isLoggedIn, async (req, res, next) => {
  try {
    const activePosts = await User.find({hiring: "on"});
    res.render("auth/home", { activePosts });
    console.log({ activePosts });
  } catch (err) {
    console.log(err);
  }
});


// router.get("/home", isLoggedIn, (req, res, next) => {
//   res.render("auth/home");
// });

router.get("/home", isLoggedOut, (req, res, next) => {
    res.render("index");
  });

  // router.get("/celebrities", async (req, res) => {
  //   try {
  //     const allCelebrities = await CelebrityModel.find();
  //     res.render("celebrities/celebrities", { allCelebrities });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // });



router.get("/post/:id", isLoggedIn, async (req, res, next) => {
  try {
    const onePost = await User.findById(req.params.id);
    console.log(onePost);
    res.render("auth/post", { onePost });
  } catch (err) {
    console.log(err);
  }
});

// router.get("/:id", async (req, res) => {
//   try {
//     const oneCelebrity = await CelebrityModel.findById(req.params.id);
//     console.log(oneCelebrity);
//     res.render("celebrities/celebrity-details", { oneCelebrity });
//   } catch (err) {
//     console.log(err);
//   }
// });



router.get("/post", isLoggedOut, (req, res, next) => {
  res.render("index");
});

router.get("/profile", isLoggedIn, (req, res, next) => {
  res.render("auth/profile");
});

router.get("/profile", isLoggedOut, (req, res, next) => {
  res.render("index");
});

router.post("/profile", isLoggedIn, async (req, res, next) => {

  // use session to identify the user to be updated 
  console.log(req.session);
  console.log(req.body);
  const onePost = await User.findOneAndUpdate({email: req.session.user.email},{
    name: req.body.Name,     
    location: req.body.Location, 
    company: req.body.Company, 
    hiring: req.body.Hiring,
    position: req.body.Position
  }, {new: true});

  console.log("Hi", onePost);
  
  res.render("auth/post", { onePost });

    // res.render("auth/post");
  });


  router.get("/logout", isLoggedIn, (req, res, next) => {
    req.session.destroy();
    // res. clearCookie('nToken'); return res. redirect('/'); 
      //req.logout();
    res.redirect("/home");

  });


module.exports = router;
