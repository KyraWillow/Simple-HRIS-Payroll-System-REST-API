const express = require("express");
const router = express.Router();

const employeeController = require("./employee.controller");
const verifyToken = require("../middlewares/verifyToken");
const authorizeRole = require("../middlewares/authorizeRole");

router.get("/", employeeController.showAllEmployeeData);
router.get("/profile", employeeController.showProfileEmployee);
router.post(
  "/",
  verifyToken,
  authorizeRole("HR_ADMIN"),
  employeeController.registerEmployee,
);
module.exports = router;
