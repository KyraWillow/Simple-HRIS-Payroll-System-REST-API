const jwt = require("jsonwebtoken");
const appError = require("../utils/AppError");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    throw new appError("Token required.", 401);
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decode;

    next();
  } catch (error) {
    throw new appError("Invalid token.", 401);
  }
};

module.exports = verifyToken;
