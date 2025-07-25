const express = require('express');
const router = express.Router();
const {
  createTaskRecord,
 } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createTaskRecord);



module.exports = router;
