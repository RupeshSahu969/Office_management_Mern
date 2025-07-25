const express = require('express');
const router = express.Router();
const {  getEmployeeProjects,getProjectById,updateProject
  } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
// Create project

router.get('/', protect, getEmployeeProjects);
router.get('/:id', protect, getProjectById);
router.put('/:id', protect,  updateProject);


module.exports = router;
