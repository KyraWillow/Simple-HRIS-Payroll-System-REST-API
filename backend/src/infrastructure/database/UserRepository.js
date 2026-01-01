const { prisma } = require("./DatabaseConnection");
const ApplicationError = require("../../shared/errors/ApplicationError");

class UserRepository {
  async findByEmail(email) {
    try {
      const user = await prisma.users.findUnique({
        where: { email },
      });
      return user;
    } catch (error) {
      throw new ApplicationError("User email not found", 404);
    }
  }

  async findById(id) {
    try {
      const user = await prisma.users.findUnique({
        where: { id },
      });
      return user;
    } catch (error) {
      throw new ApplicationError("User Id not found", 404);
    }
  }

  async create(userData) {
    try {
      const user = await prisma.users.create({
        data: userData,
      });
      return user;
    } catch (error) {
      throw new ApplicationError("User creation failed", 400);
    }
  }

  async update(id, userData) {
    try {
      const user = await prisma.users.update({
        where: { id },
        data: userData,
      });
      return user;
    } catch (error) {
      throw new ApplicationError("User update failed", 400);
    }
  }

  async findAll() {
    try {
      const users = await prisma.users.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          base_salary: true,
          join_date: true,
        },
      });
      return users;
    } catch (error) {
      throw new ApplicationError("Database error occured", 500);
    }
  }
}

module.exports = UserRepository;
