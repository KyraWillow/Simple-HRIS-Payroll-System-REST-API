const bcrypt = require("bcrypt");
const validateEmail = require("email-validator");

class UserEntity {
  constructor(id, name, email, password, role, baseSalary, joinDate) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
    this.baseSalary = baseSalary;
    this.joinDate = joinDate;
  }

  validate() {
    if (!this.email || !this.isValidEmail(this.email)) {
      throw new Error("Email is required and must be valid");
    }

    if (!this.name || this.name.length < 2) {
      throw new Error(
        "Name is required and must be at least 2 characters long",
      );
    }
    return true;
  }

  isValidEmail(email) {
    return validateEmail.validate(email);
  }

  static async hashPassword(plainPassword) {
    const salt = 12;
    const hashPassword = await bcrypt.hash(plainPassword, salt);
    return hashPassword;
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    const isPasswordValid = await bcrypt.compare(plainPassword, hashedPassword);
    return isPasswordValid;
  }
}
module.exports = UserEntity;
