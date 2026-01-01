const jwt = require("jsonwebtoken");
const ApplicationError = require("../errors/ApplicationError");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers["authoorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      throw new ApplicationError("Access token is required", 401);
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    next();
  } catch (error) {
    throw new ApplicationError("Invalid token", 401);
  }
  next(error);
};

module.exports = authMiddleware;
