import React, { useEffect, useState } from 'react';
import api from '../Api/Api';
import { useAuth } from '../AuthContext/AuthContext';

const Project = () => {
  const { token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editedProjectId, setEditedProjectId] = useState(null);
  const [formData, setFormData] = useState({
    status: '',
    startDate: '',
    endDate: '',
    description: '',
  });
  const [message, setMessage] = useState(''); // New state for messages

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await api.get('/projects', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch projects.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditClick = (project) => {
    setEditedProjectId(project._id); // Set the project we're editing
    setFormData({
      status: project.status,
      startDate: new Date(project.startDate).toISOString().slice(0, 16),  // Correct format
      endDate: new Date(project.endDate).toISOString().slice(0, 16),  // Correct format
      description: project.description,
    });
    setMessage(''); // Clear any previous messages when starting to edit
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editedProjectId) return;

    try {
      await api.put(
        `projects/${editedProjectId}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage('Project updated successfully!');  // Success message
      fetchProjects(); // Refetch projects to update the list
      setEditedProjectId(null); // Close the edit form
    } catch (error) {
      console.error('Error updating project:', error);
      setMessage('Failed to update project. Please try again.'); // Error message
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Projects</h2>
      {loading && <p>Loading projects...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Display the message */}
      {message && <p className="text-green-500">{message}</p>}

      <ul className="list-none">
        {projects.length > 0 ? (
          projects.map((project) => (
            <li
              key={project._id}
              className="mb-4 p-4 border rounded-lg shadow-md bg-white"
            >
              <h3 className="text-xl font-semibold text-blue-500">{project.Projectname}</h3>
              <p>Status: <span className="font-semibold text-gray-600">{project.status}</span></p>
              <p>Created By: <span className="font-semibold text-gray-700">{project.createdBy.username}</span></p>
              <p>Description: {project.description}</p>
              <p>Start Date: {new Date(project.startDate).toLocaleDateString()}</p>
              <p>End Date: {new Date(project.endDate).toLocaleDateString()}</p>

              {/* Show edit form only if the current project is the one being edited */}
              {editedProjectId === project._id ? (
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div>
                    <label className="block font-semibold" htmlFor="status">Status</label>
                    <input
                      type="text"
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold" htmlFor="startDate">Start Date</label>
                    <input
                      type="datetime-local"
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold" htmlFor="endDate">End Date</label>
                    <input
                      type="datetime-local"
                      id="endDate"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold" htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded-lg w-full">
                    Save Changes
                  </button>
                </form>
              ) : (
                // Show the edit button when not editing
                <button
                  onClick={() => handleEditClick(project)}
                  className="mt-4 bg-yellow-500 text-white p-2 rounded-lg w-full"
                >
                  Edit Project
                </button>
              )}
            </li>
          ))
        ) : (
          <p>No projects found.</p>
        )}
      </ul>
    </div>
  );
};

export default Project;
