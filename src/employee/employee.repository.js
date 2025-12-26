const { prisma } = require("../config/database");
const AppError = require("../utils/AppError");

const findAllEmployeeUserData = async () => {
  try {
    const employee = await prisma.users.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        base_salary: true,
        join_date: true,
      },
    });
    return employee;
  } catch (error) {
    console.error("Prisma Error:", error);
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    console.error("Error meta:", error.meta);

    throw new AppError("Failed to retrieve employee data", 400);
  }
};

const findEmployeeData = async (id) => {
  const employee = await prisma.users.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      base_salary: true,
      join_date: true,
      attendances: true,
      payroll: true,
    },
  });
  return employee;
};

const createNewEmployeeData = async (
  name,
  email,
  password,
  role,
  base_salary,
) => {
  try {
    const employee = await prisma.users.create({
      data: {
        name: name,
        email: email,
        password: password,
        role: role,
        base_salary: base_salary,
      },
    });
    return employee;
  } catch (error) {
    throw new AppError("The data sent is invalid.", 400);
  }
};

module.exports = {
  findAllEmployeeUserData,
  findEmployeeData,
  createNewEmployeeData,
};
