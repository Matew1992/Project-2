const express = require('express');
const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("auth/home");
});

router.post("/", (req, res, next) => {
    res.render("auth/home");
  });

module.exports = router;