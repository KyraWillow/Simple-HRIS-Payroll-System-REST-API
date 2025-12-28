const { prisma } = require("../config/database");
const AppError = require("../utils/AppError");
const {
  getAllEmployeeData,
  profileEmployee,
  registerEmployeeData,
} = require("./employee.service");

const showAllEmployeeData = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    let token = " ";

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else {
      token = authHeader;
    }

    const showEmployee = await getAllEmployeeData(token);

    res.status(200).json({
      data: showEmployee,
    });
  } catch (error) {
    next(error);
  }
};

const showProfileEmployee = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    let token = " ";

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else {
      token = authHeader;
    }

    const showProfile = await profileEmployee(token);

    res.status(200).json({
      data: showProfile,
    });
  } catch (error) {
    error;
  }
};

const registerEmployee = async (req, res, next) => {
  try {
    const tokenRole = req.user.role;

    const { name, email, password, role, base_salary } = req.body;

    const employee = await registerEmployeeData(
      name,
      email,
      password,
      role,
      base_salary,
      tokenRole,
    );

    res.status(201).json({
      message: "Employee registered successfully",
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  showAllEmployeeData,
  showProfileEmployee,
  registerEmployee,
};
