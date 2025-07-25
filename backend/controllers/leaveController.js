// controllers/leaveController.js
const Leave = require('../models/leave');

const createLeaveRecord = async (req, res) => {
  try {
    const leaveData = {
      ...req.body,
      userId: req.user._id,
      status: 'Pending',
    };
    const newLeave = await Leave.create(leaveData);
    return res.status(201).json({ message: "Leave request submitted", newLeave });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
};

const getLeavesForEmployee = async (req, res) => {
  try {
    const leaves = await Leave.find({ userId: req.user._id });  // use req.user._id from token auth
    console.log(leaves)
    return res.status(200).json(leaves);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};



const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().populate('userId', 'name email');
    return res.status(200).json(leaves);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


module.exports = {
  createLeaveRecord,
  getLeavesForEmployee,
  getAllLeaves,
};
