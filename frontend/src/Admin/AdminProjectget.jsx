import React, { useEffect, useState } from 'react';
import api from '../Api/Api';
import { useAuth } from '../AuthContext/AuthContext';

const AdminProjectGet = () => {
  const { token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/projects', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch projects.');
      setLoading(false);
    }
  };

  const deleteProject = async (projectId) => {
    try {
      await api.delete(`/admin/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(projects.filter((project) => project._id !== projectId)); // Remove the deleted project from the state
    } catch (err) {
      setError('Failed to delete project.');
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const renderProjectStatus = (status) => {
    switch (status) {
      case 'in-progress':
        return <span className="bg-yellow-500 text-white px-3 py-1 rounded-full">In-progress</span>;
      case 'completed':
        return <span className="bg-green-500 text-white px-3 py-1 rounded-full">Completed</span>;
      case 'Complete':
        return <span className="bg-green-700 text-white px-3 py-1 rounded-full">Completed</span>;
      default:
        return <span className="bg-blue-500 text-white px-3 py-1 rounded-full">Pending</span>;
    }
  };

  if (loading) {
    return <div className="text-center text-xl text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-xl text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Admin Project Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project._id} className="bg-white shadow-lg rounded-lg p-5">
            <h3 className="text-xl font-semibold text-gray-900">{project.Projectname}</h3>
            <p className="text-sm text-gray-600 mt-2">{project.description}</p>

            <div className="mt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Status</span>
                {renderProjectStatus(project.status)}
              </div>

              <div className="mt-2 text-sm text-gray-500">
                <div><strong>Assigned Employees:</strong> {project.assignedEmployees.length > 0 ? project.assignedEmployees.map(emp => <div key={emp._id}>{emp.name} ({emp.email})</div>) : 'None'}</div>
                <div><strong>Created By:</strong> {project.createdBy.username}</div>
                <div><strong>Start Date:</strong> {new Date(project.startDate).toLocaleDateString()}</div>
                <div><strong>End Date:</strong> {new Date(project.endDate).toLocaleDateString()}</div>
              </div>
            </div>

            <div className="mt-4 flex justify-between space-x-2">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Edit</button>
              <button
                onClick={() => deleteProject(project._id)}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProjectGet;
