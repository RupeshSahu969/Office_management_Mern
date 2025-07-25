const Notification = require('../models/notification');

const getAllNotificationRecords = async (req, res) => {
  try {
    const notificationRecords = await Notification.find();
    res.json(notificationRecords);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getNotificationRecordById = async (req, res) => {
  try {
    const notificationRecord = await Notification.findById(req.params.id);
    if (!notificationRecord) return res.status(404).json({ message: 'Not found' });
    res.json(notificationRecord);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createNotificationRecord = async (req, res) => {
  try {
    const newNotification = new Notification(req.body);
    await newNotification.save();
    res.status(201).json(newNotification);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateNotificationRecord = async (req, res) => {
  try {
    const updated = await Notification.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteNotificationRecord = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllNotificationRecords,
  getNotificationRecordById,
  createNotificationRecord,
  updateNotificationRecord,
  deleteNotificationRecord
};
