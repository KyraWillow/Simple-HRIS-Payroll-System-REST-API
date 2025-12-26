const express = require("express");
const { prisma } = require("../config/database");
const { loginUserData, registerUserData } = require("./auth.service");

const newLoginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const userLogin = await loginUserData(email, password);

    res.status(200).json({
      message: "Login success.",
      token: userLogin,
    });
  } catch (error) {
    next(error);
  }
};

const newRegisterUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const userRegister = await registerUserData(name, email, password);

    res.status(200).json({
      message: "Register success.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  newLoginUser,
  newRegisterUser,
};
