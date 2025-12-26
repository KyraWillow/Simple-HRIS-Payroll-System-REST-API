const express = require("express");
const router = express.Router();

const employeeController = require("./employee.controller");

router.get("/", employeeController.showAllEmployeeData);

module.exports = router;
