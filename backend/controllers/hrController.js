const Employee = require('../models/employee');
const Task = require('../models/task');
const Leave = require('../models/leave');
const Attendance = require('../models/attendance');
const Project = require('../models/project');
const mongoose = require('mongoose');
// Get all employees (basic info)
const getAllEmployeeData = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch employees', error: err.message });
  }
};

// Get tasks by employee userId
const getEmployeeTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.params.id });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tasks', error: err.message });
  }
};

const getEmployeeLeave = async (req, res) => {
  const { id } = req.params;

  try {
    // Populate userId to get employee details (name, email)
    const leaves = await Leave.find({ userId: id }).populate('userId', 'name email');

    if (!leaves.length) {
      return res.status(404).json({ message: 'No leave records found for this employee' });
    }

    res.status(200).json(leaves);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch leave data', error: err.message });
  }
};
// Get attendance by employee userId
const getEmployeeAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ userId: req.params.id });
    res.status(200).json(attendance);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch attendance', error: err.message });
  }
};

const assignEmployeesToProject = async (req, res) => {
  try {
    const { Projectname, status, startDate, endDate, description, employeeIds } = req.body;
   
    const hrUserId = req.user._id;

    // Validate employeeIds
    if (!Array.isArray(employeeIds) || employeeIds.length === 0) {
      return res.status(400).json({ message: 'employeeIds must be a non-empty array' });
    }

   
    const newProject = new Project({
      Projectname,
      status,
      startDate,
      endDate,
      description,
      createdBy: hrUserId,
      assignedEmployees: employeeIds,
    });

    // console.log(employeeIds)

    await newProject.save();

    res.status(201).json({
      message: 'Project created and employees assigned successfully',
      project: newProject,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error creating project', error: err.message });
  }
};
// GET: HR can only see projects they have created
const getProjectsByHR = async (req, res) => {
  try {
    const hrUserId = req.user._id; // Get HR user ID from req.user

    // Fetch all projects created by this HR user and populate employee details
    const projects = await Project.find({ createdBy: hrUserId })
                                   .populate('assignedEmployees', 'name email');  // Populate employee name and email

    if (!projects || projects.length === 0) {
      return res.status(404).json({ message: 'No projects found for this HR user' });
    }

    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching projects', error: err.message });
  }
};

const updateLeaveStatus = async (req, res) => {
  try {
    const leaveId = req.params.id;
    const { status } = req.body;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const updatedLeave = await Leave.findByIdAndUpdate(
      leaveId,
      {
        status,
        approvedBy: req.user._id,
      },
      { new: true }
    ).populate('userId', 'name email');

    if (!updatedLeave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    res.status(200).json({ message: 'Leave status updated', updatedLeave });
  } catch (err) {
    res.status(500).json({ message: 'Error updating leave status', error: err.message });
  }
};


module.exports = {
  getAllEmployeeData,
  getEmployeeTasks,
  getEmployeeLeave,
  getEmployeeAttendance,
  assignEmployeesToProject,
  getProjectsByHR,
  updateLeaveStatus,

};
