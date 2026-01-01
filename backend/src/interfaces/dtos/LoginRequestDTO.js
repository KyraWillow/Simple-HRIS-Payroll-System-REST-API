const validateEmail = require("email-validator");

class LoginRequestDTO {
  constructor(email, password) {
    this.email = email;
    this.password = password;
  }

  validate() {
    const errors = [];

    if (!this.email) {
      errors.push("Email is required.");
    } else if (!this.isValidEmail(this.email)) {
      errors.push("Email format is invalid");
    }

    if (!this.password) {
      errors.push("Password is required.");
    } else if (this.password.length < 8) {
      errors.push("Password must be at least 8 characters long.");
    }

    if (errors.length > 0) {
      throw new Error(errors.join(", "));
    }

    return true;
  }

  isValidEmail(email) {
    return validateEmail.validate(email);
  }

  sanitize() {
    this.email = this.email.trim().toLowerCase();
  }
}

module.exports = LoginRequestDTO;
