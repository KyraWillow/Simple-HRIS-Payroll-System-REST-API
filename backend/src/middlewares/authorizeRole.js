const appError = require("../utils/AppError");

const authorizeRole = (...allowedRole) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      throw new appError("Unauthorized role not found", 401);
    }

    if (allowedRole.includes(req.user.role)) {
      next();
    } else {
      throw new appError(
        "Forbidden you are not authorized to access this resource",
        403,
      );
    }
  };
};

module.exports = authorizeRole;
