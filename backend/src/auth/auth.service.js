const { prisma } = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const appError = require("../utils/AppError");
const { loginUser, registerUser } = require("./auth.repository");

const loginUserData = async (email, password) => {
  const user = await loginUser(email);

  if (!user) {
    throw new appError("User not found.", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new appError("Wrong password.", 401);
  }

  const payload = {
    id: user.id,
    role: user.role,
  };

  const secret = process.env.JWT_SECRET;

  const token = jwt.sign(payload, secret, {
    expiresIn: "1h",
  });
  return token;
};

module.exports = {
  loginUserData,
};
