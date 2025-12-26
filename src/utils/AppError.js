class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Menandakan ini error yang kita antisipasi
  }
}

module.exports = AppError;
