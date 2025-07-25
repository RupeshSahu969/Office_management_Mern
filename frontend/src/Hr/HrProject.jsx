import React, { useEffect, useState, useCallback } from 'react';
import api from '../Api/Api'; // Your axios instance
import { useAuth } from '../AuthContext/AuthContext'; // Assumes you store token here

const HrProject = () => {
  const { token, id } = useAuth(); // We get `id` from the Auth context
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    Projectname: '',
    description: '',
    startDate: '',
    endDate: '',
    status: '',
    assignedEmployees: [],
  });
  const [message, setMessage] = useState('');

  // Fetch employees (not including the logged-in user)
  const fetchEmployees = useCallback(async () => {
    if (!token) return; // Guard clause in case token is not available

    try {
      const res = await api.get('/hr/employees', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEmployees(res.data.filter((emp) => emp.userId !== id));
    } catch (err) {
      console.error('Failed to fetch employees', err);
    }
  }, [token, id]);

  // Fetch projects that the logged-in user can see
  const fetchProjects = useCallback(async () => {
    if (!token) return; // Guard clause in case token is not available

    try {
      const res = await api.get('/hr/projects', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProjects(res.data);
    } catch (err) {
      console.error('Failed to fetch projects', err);
    }
  }, [token]);

  // Run fetch functions when component mounts or token changes
  useEffect(() => {
    fetchEmployees();
    fetchProjects();
  }, [fetchEmployees, fetchProjects]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle employee selection
  const handleEmployeeChange = (e) => {
    const selectedEmployees = Array.from(e.target.selectedOptions, (option) => option.value);
    // Make sure that the logged-in user ID is always included in the list of assigned employees
    if (!selectedEmployees.includes(id)) {
      selectedEmployees.push(id);
    }
    setFormData((prev) => ({
      ...prev,
      assignedEmployees: selectedEmployees,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedData = {
      Projectname: formData.Projectname,
      status: formData.status,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
      description: formData.description,
      employeeIds: formData.assignedEmployees, // Send the employee IDs (including the logged-in user)
    };

    try {
      const res = await api.post('/hr/projects', formattedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res);
      setMessage('Project created successfully!');
      setFormData({
        Projectname: '',
        description: '',
        startDate: '',
        endDate: '',
        status: '',
        assignedEmployees: [],
      });
      fetchProjects(); // Refresh the project list
    } catch (err) {
      console.error('Error creating project', err);
      setMessage('Error creating project. Please try again.');
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Post New Project</h2>

      {/* Display success or error message */}
      {message && (
        <div className={`p-4 mb-4 ${message.includes('successfully') ? 'bg-green-200' : 'bg-red-200'} rounded`}>
          <p className="text-center">{message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <input
          type="text"
          name="Projectname"
          placeholder="Project Name"
          value={formData.Projectname}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="planning">Planning</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="on hold">On Hold</option>
        </select>
        <textarea
          name="description"
          placeholder="Project Description"
          value={formData.description}
          onChange={handleChange}
          className="border p-2 rounded col-span-full"
          required
        />

        {/* Employees Select */}
        <select
          multiple
          name="assignedEmployees"
          value={formData.assignedEmployees}
          onChange={handleEmployeeChange}
          className="col-span-full border p-2 rounded"
        >
          <option>Select Employees</option>
          {employees.map((emp) => (
            <option key={emp._id} value={emp.userId}>
              {emp.email}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded col-span-full"
        >
          Create Project
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-2">Your Created Projects</h2>
      <table className="w-full border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">Project Name</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Assigned Employees</th>
            <th className="p-2 border">Start Date</th>
            <th className="p-2 border">End Date</th>
            <th className="p-2 border">Description</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project._id}>
              <td className="p-2 border">{project.Projectname}</td>
              <td className="p-2 border">{project.status}</td>
              <td className="p-2 border">
                {project.assignedEmployees.map((emp) => emp.email).join(', ')}
              </td>
              <td className="p-2 border">{new Date(project.startDate).toLocaleDateString()}</td>
              <td className="p-2 border">{new Date(project.endDate).toLocaleDateString()}</td>
              <td className="p-2 border">{project.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HrProject;
