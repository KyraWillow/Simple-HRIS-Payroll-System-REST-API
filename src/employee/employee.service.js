const { prisma } = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const appError = require("../utils/AppError");
const { findAllEmployeeUserData } = require("./employee.repository");

const getAllEmployeeData = async (userToken) => {
  if (!userToken) {
    throw new appError("User token is required.");
  }

  const userTokenDecoded = jwt.verify(userToken, process.env.JWT_SECRET);

  if (userTokenDecoded.role !== "HR_ADMIN") {
    throw new appError(
      "User is not authorized to show all employee data.",
      403,
    );
  }

  const employee = await findAllEmployeeUserData();

  return employee;
};

module.exports = {
  getAllEmployeeData,
};
