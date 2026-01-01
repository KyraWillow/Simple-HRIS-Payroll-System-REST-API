const express = require("express");
const router = express.Router();
const UserRepository = require("../database/UserRepository");
const LoginUserUseCase = require("../../core/usecases/auth/LoginUserUseCase");
const AuthController = require("../controllers/AuthController");

const userRepository = new UserRepository();
const loginUserUseCase = new LoginUserUseCase(userRepository);
const authController = new AuthController(loginUserUseCase);

router.post("/login", authController.login.bind(authController));

module.exports = router;
