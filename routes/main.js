const express = require("express");
const router = express.Router();
const isLoggedIn = require("../utils/isLoggedIn");

router.get("", (req, res) => {
  res.render("landing");
});

router.get("/account", isLoggedIn, (req, res) => {
  res.render("account");
});

router.get("/contact", (req, res) => {
  res.render("contact");
});

router.get("/aboutme", (req, res) => {
  res.render("aboutme");
});
module.exports = router;
