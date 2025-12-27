const { prisma } = require("../config/database");

const loginUser = async (email) => {
  try {
    const user = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });
    return user;
  } catch (err) {
    throw new Error("Database error " + err.message);
  }
};

const registerUser = async (name, email, password) => {
  try {
    const user = await prisma.users.create({
      data: {
        name: name,
        email: email,
        password: password,
      },
    });
    return user;
  } catch (err) {
    throw new Error("Database error " + err.message);
  }
};

module.exports = {
  loginUser,
  registerUser,
};
