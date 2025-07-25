const mongoose = require('mongoose');

// Define the schema for the Project model
const projectSchema = new mongoose.Schema(
  {
    Projectname: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['planning', 'in-progress', 'completed', 'on hold'],
      // default: 'planning', 
    },
    assignedEmployees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',  // Reference to the Employee model
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  // Reference to the User who created the project (Admin)
      required: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }  // Automatically adds createdAt and updatedAt fields
);

// Create and export the model
module.exports = mongoose.model('Project', projectSchema);
