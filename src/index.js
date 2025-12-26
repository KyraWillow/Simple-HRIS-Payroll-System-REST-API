const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

const authRoutes = require("./auth/auth.routes");

app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log("App is running in " + PORT);
});
