const User = require("../models/user");
const Employee = require("../models/employee");
const ExcelJS = require("exceljs");
const Project = require("../models/project");

const exportUsersToExcel = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("User");

    worksheet.columns = [
      { header: "Username", key: "username", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Role", key: "role", width: 15 },
      { header: "Created At", key: "createdAt", width: 25 },
    ];

    users.forEach((user) => {
      worksheet.addRow({
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt.toLocaleString(),
      });
    });

    res.setHeader("Content-Disposition", "attachment; filename=users.xlsx");
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    await workbook.xlsx.write(res).then(() => res.end());
  } catch (err) {
    res.status(500).json({ message: "Export failed", error: err.message });
  }
};

const exportEMployeeToExcel = async (req, res) => {
  try {
    // Fetch employees from the database, excluding the password field
    const employees = await Employee.find().select("-password");

    // Create a new ExcelJS workbook and add a worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Employee");

    // Define the columns for the Excel worksheet
    worksheet.columns = [
      { header: "Name", key: "name", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Role", key: "role", width: 15 },
      { header: "Phone", key: "phone", width: 20 },
      { header: "Department", key: "department", width: 20 },
      { header: "Address", key: "address", width: 30 },
      { header: "Joining Date", key: "joiningDate", width: 20 },
      { header: "Created At", key: "createdAt", width: 50 },
    ];

    // Loop through each employee and add their data to the worksheet
    employees.forEach((user) => {
      worksheet.addRow({
        name: user.name || "N/A",
        email: user.email || "N/A",
        phone: user.phone || "N/A",
        department: user.department || "N/A",
        address: user.address || "N/A",
        joiningDate: user.joiningDate
          ? new Date(user.joiningDate).toLocaleDateString()
          : "N/A",
        createdAt: user.createdAt
          ? new Date(user.createdAt).toLocaleDateString()
          : "N/A",
      });
    });

    // Set headers for file download and content type for Excel
    res.setHeader("Content-Disposition", "attachment; filename=employees.xlsx");
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    // Write the workbook to the response stream
    await workbook.xlsx.write(res);
    res.end(); // End the response after writing the file
  } catch (err) {
    // Handle errors and log them for debugging
    console.error("Export failed:", err);
    res.status(500).json({ message: "Export failed", error: err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch users", error: err.message });
  }
};

// Get employee profile with user
const getEmployeeProfiles = async (req, res) => {
  try {
    const employees = await Employee.find().populate(
      "userId",
      "username email role"
    );
    res.status(200).json(employees);
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Failed to fetch employee profiles",
        error: err.message,
      });
  }
};

// Delete any user
const deleteUserByAdmin = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted by admin" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete user", error: err.message });
  }
};

// Create user + employee profile
const createEmployeeByAdmin = async (req, res) => {
  try {
    const { username, email, password, role, department, phone, address } =
      req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const newUser = new User({ username, email, password, role });
    await newUser.save();

    const newEmployee = new Employee({
      userId: newUser._id,
      name: username,
      email,
      role,
      department,
      phone,
      address,
    });
    await newEmployee.save();

    res
      .status(201)
      .json({
        message: "Employee created by admin",
        user: newUser,
        employee: newEmployee,
      });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to create employee", error: err.message });
  }
};







const getUserCounts = async (req, res) => {
  try {
    const userCount = await User.countDocuments();

    res.status(200).json( userCount );
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch counts", error: err.message });
  }
};
const getEmployeeCount = async (req, res) => {
  try {
    const employeeCount = await Employee.countDocuments();
    res.status(200).json(employeeCount );
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch employee count", error: err.message });
  }
};

const getUserCountByRole = async (req, res) => {
  try {
    const pipeline = [
      { $group: { _id: "$role", count: { $sum: 1 } } },
    ];

    const counts = await User.aggregate(pipeline);

    res.status(200).json(counts);
  } catch (err) {
    res.status(500).json({ message: "Failed to get role counts", error: err.message });
  }
};

const getAllProjects = async (req, res) => {
  try {
    // Fetch all projects and populate related fields (assignedEmployees and createdBy)
    const projects = await Project.find()
      .populate('assignedEmployees', 'name email') // Populate assigned employees with 'name' and 'email'
      .populate('createdBy', 'username') // Populate the creator (Admin) with 'username'
      .exec();

    if (!projects.length) {
      return res.status(404).json({ message: 'No projects found' });
    }

    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch projects', error: err.message });
  }
};

const deleteProjectByAdmin = async (req, res) => {
  try {
    // Find the project by ID and delete it
    const project = await Project.findByIdAndDelete(req.params.id);

    console.log(project)
    // If project does not exist, send a 404 response
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Success response
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (err) {
    // Error handling
    console.error(err);
    res.status(500).json({ message: "Failed to delete project", error: err.message });
  }
};

module.exports = {
  getAllUsers,
  getEmployeeProfiles,
  deleteUserByAdmin,
  createEmployeeByAdmin,
  exportUsersToExcel,
  exportEMployeeToExcel,
  getUserCounts,
  getEmployeeCount,
  getUserCountByRole,
  deleteProjectByAdmin,
  getAllProjects
};
