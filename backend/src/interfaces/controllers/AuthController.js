class AuthController {
  constructor(loginUserUseCase) {
    this.loginUserUseCase = loginUserUseCase;
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await this.loginUserUseCase.execute(email, password);

      res.status(200).json({
        success: true,
        message: "Login successful",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

// Export class untuk testing dan instance untuk production
module.exports = AuthController;
