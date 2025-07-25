const Task = require('../models/task');


const createTaskRecord = async (req, res) => {
  try {
    const newTask = new Task(req.body);
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {

  createTaskRecord,
};

