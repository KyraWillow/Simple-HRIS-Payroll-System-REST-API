const { prisma } = require("../config/database");
const AppError = require("../utils/AppError");
const { getAllEmployeeData } = require("./employee.service");

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

module.exports = {
  showAllEmployeeData,
};
