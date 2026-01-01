// src/index.js
const express = require("express");
const cors = require("cors");

const authRoutes = require("./interfaces/routes/auth.routes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Dependency Injection - membuat instance dan menghubungkan semuanya

// Routes
app.use("/auth", authRoutes);

// Global error handler
app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal Server Error",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
