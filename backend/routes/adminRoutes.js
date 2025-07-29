const express = require("express");
const router = express.Router();
const { protect ,hrOnly,adminOnly} = require("../middleware/authMiddleware");
const {
  getAllUsers,
  getEmployeeProfiles,
  deleteUserByAdmin,
  createEmployeeByAdmin,
  exportUsersToExcel,
  exportEMployeeToExcel,
  getUserCounts,
  getEmployeeCount,
  getUserCountByRole,getAllProjects,deleteProjectByAdmin
} = require("../controllers/adminControlles");

router.get("/export-users", protect, exportUsersToExcel);
router.get("/export-employee", protect, exportEMployeeToExcel);
router.get("/users", protect, getAllUsers); 
router.get("/employees", protect, getEmployeeProfiles); 
router.delete("/user/:id", protect, deleteUserByAdmin); 
router.post("/employee", protect, createEmployeeByAdmin); 
router.get("/usercount", getUserCounts);
router.get("/employeecount", getEmployeeCount);
router.get("/user-role-count", protect, getUserCountByRole);
router.get("/projects", protect,hrOnly,adminOnly, getAllProjects);
router.delete('/projects/:id',protect,adminOnly, deleteProjectByAdmin);
module.exports = router;
