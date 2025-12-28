const { prisma } = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const appError = require("../utils/AppError");
const {
  findAllEmployeeUserData,
  profileEmployeeData,
  createNewEmployeeData,
  findUserByEmail,
} = require("./employee.repository");

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

const profileEmployee = async (userToken) => {
  if (!userToken) {
    throw new appError("User token is required.");
  }

  const tokenDecoded = jwt.verify(userToken, process.env.JWT_SECRET);

  const employee = await profileEmployeeData(tokenDecoded.id);

  return employee;
};

const registerEmployeeData = async (
  name,
  email,
  password,
  role,
  base_salary,
  tokenRole,
) => {
  if (!tokenRole) {
    throw new appError("User token is required.");
  }

  const validateEmployeeEmail = await findUserByEmail(email);

  if (validateEmployeeEmail) {
    throw new appError("An email address can only be registered once.", 409);
  }

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  const employee = await createNewEmployeeData(
    name,
    email,
    hashedPassword,
    role,
    base_salary,
  );

  return employee;
};

module.exports = {
  getAllEmployeeData,
  profileEmployee,
  registerEmployeeData,
};
