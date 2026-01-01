const ApplicationError = require("../../../shared/errors/ApplicationError");

class LoginUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(email, password) {
    if (!email || !password) {
      throw new ApplicationError("Email or password required", 400);
    }

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new ApplicationError("Invalid credentials", 401);
    }
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}

module.exports = LoginUserUseCase;
