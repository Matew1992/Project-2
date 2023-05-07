const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("auth/post");
});

router.post("/", (req, res, next) => {
    res.render("auth/post");
  });

module.exports = router;