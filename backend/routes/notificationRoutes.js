const express = require('express');
const router = express.Router();
const {getAllNotificationRecords,
  getNotificationRecordById,
  createNotificationRecord,
  updateNotificationRecord,
  deleteNotificationRecord} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');
// Send notification
router.get('/', protect, getAllNotificationRecords);
router.get('/:id', protect, getNotificationRecordById);
router.post('/', protect, createNotificationRecord);
router.put('/:id', protect, updateNotificationRecord);
router.delete('/:id', protect, deleteNotificationRecord);




module.exports = router;
