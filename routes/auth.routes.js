// const saltRounds = 10;
// const isLoggedIn = require("../middlewares/loggedIn");
// const isLoggedOut = require("../middlewares/loggedOut")

const router = require("express").Router();
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard.js");

const User = require("../models/User.model");
const bcryptjs = require("bcryptjs");

require("../db");

// router.get("/register", isLoggedOut, (req, res) => {
//   res.render("auth/register");
// });

// router.post("/register", async (req, res) => {
//   console.log(req.body);

//   const salt = await bcryptjs.genSalt(12);
//   const hash = await bcryptjs.hash(req.body.password, salt);
//   const user = new User({ email: req.body.email, password: hash });
//   await user.save();

//   res.send("signed up");
//   console.log(hash);
// });



router.get("/", isLoggedOut, (req, res) => {
  res.render("index");
});

router.post("/", async (req, res, next) => {
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

    req.session.user = {
      email: user.email,
    };

    res.redirect("/profile");
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.get("/home", isLoggedIn, (req, res) => {
  res.render("auth/home");
});

router.get("/home", isLoggedOut, (req, res) => {
    res.render("index");
  });

router.get("/post", isLoggedIn, (req, res) => {
  res.render("auth/post");
});

module.exports = router;
