const express = require("express");
const router = express.Router();

const authController = require("./auth.controller");

router.post("/login", authController.newLoginUser);
router.post("/register", authController.newRegisterUser);

module.exports = router;
