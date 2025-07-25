const Employee = require("../models/employee");

// Get employee profile based on logged-in user
const getMyEmployeeProfile = async (req, res) => {
  try {
    let employee = await Employee.findOne({ userId: req.user._id });

    if (!employee) {
      // Optional: auto-create profile if it doesn't exist
      employee = await Employee.create({
        userId: req.user._id,
        name: req.user.username,
        email: req.user.email,
        department: 'Not Assigned',
      });
    }

    // Sync email if mismatched
    if (!employee.email || employee.email !== req.user.email) {
      employee.email = req.user.email;
      await employee.save();
    }

    res.status(200).json(employee);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



// Update only current employee's profile by userId
const updateMyEmployeeProfile = async (req, res) => {
  try {
    const updated = await Employee.findOneAndUpdate(
      { userId: req.user._id },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json({ message: "Profile updated successfully", profile: updated });
  } catch (err) {
    res.status(400).json({ message: "Update failed", error: err.message });
  }
};

module.exports = {
  getMyEmployeeProfile,
  updateMyEmployeeProfile,
};
