const express = require('express');
const router = express.Router();

router.get("/mydetails", (req, res, next) => {
  res.render("auth/mydetails");
});

router.post("/mydetails", (req, res, next) => {
    res.render("auth/mydetails");
  });

module.exports = router;