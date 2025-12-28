const { prisma } = require("../config/database");
const appError = require("../utils/AppError");

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
    throw new appError("Failed to retrieve employee data", 400);
  }
};

const findUserByEmail = async (email) => {
  try {
    const user = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });
    return user;
  } catch (error) {
    throw new appError("Failed to retrieve employee data", 400);
  }
};

const profileEmployeeData = async (id) => {
  const employee = await prisma.users.findUnique({
    where: {
      id: id,
    },
    select: {
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
      select: {
        name: true,
        email: true,
        role: true,
        base_salary: true,
        join_date: true,
      },
    });
    return employee;
  } catch (error) {
    throw new AppError("The data sent is invalid.", 400);
  }
};

module.exports = {
  findAllEmployeeUserData,
  findUserByEmail,
  profileEmployeeData,
  createNewEmployeeData,
};
