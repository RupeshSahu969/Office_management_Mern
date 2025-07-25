const Project = require('../models/project');
const Employee = require('../models/employee');

// Get all projects assigned to the current employee
const getEmployeeProjects = async (req, res) => {
  try {
    const employeeId = req.user._id;  // Employee's ID from JWT

    // Fetch projects where the employee is assigned
    const projects = await Project.find({ assignedEmployees: employeeId })
      .populate('assignedEmployees', 'name email')  // Employee details
      .populate('createdBy', 'username')  // Admin who created the project
      .exec();

    if (!projects.length) {
      return res.status(404).json({ message: 'No projects found for this employee' });
    }

    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch projects', error: err.message });
  }
};

// HR can fetch a specific project by ID
const getProjectById = async (req, res) => {
  try {
    const hrUserId = req.user._id; // Get HR user ID from req.user
    const projectId = req.params.id; // Get the project ID from params

    // Fetch project created by this HR user
    const project = await Project.findOne({ 
      _id: projectId, 
      createdBy: hrUserId 
    })
      .populate('assignedEmployees', 'name email')  // Populate employee name and email
      .populate('createdBy', 'username');  // Populate HR user details

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    console.log(project,"project details")
    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching project', error: err.message });
  }
};

// Update project route
const updateProject = async (req, res) => {
  try {
    const projectId = req.params.id; // Get the project ID from the URL params
    const { status, description, startDate, endDate } = req.body; // Get the updated fields from the request body

    // Create an object with the updated fields
    const updatedFields = {};
    if (status) updatedFields.status = status;
    if (description) updatedFields.description = description;
    if (startDate) updatedFields.startDate = startDate;
    if (endDate) updatedFields.endDate = endDate;

    // Use findByIdAndUpdate with { new: true } to get the updated project
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,  // The ID of the project to update
      updatedFields,  // Fields to update
      { new: true }  // Return the updated project
    )
    .populate('assignedEmployees', 'name email')  // Populate the assigned employees
    .populate('createdBy', 'username');  // Populate the creator

    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({ message: 'Project updated successfully', project: updatedProject });
  } catch (err) {
    res.status(500).json({ message: 'Error updating project', error: err.message });
  }
};




module.exports = {
  getEmployeeProjects,
  getProjectById,
  updateProject
};
