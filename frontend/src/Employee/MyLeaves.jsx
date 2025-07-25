import React, { useEffect, useState } from 'react';
import api from "../Api/Api";
import { useAuth } from '../AuthContext/AuthContext';

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Approved: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800',
};

const MyLeaves = () => {
  const { token } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaves = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get('/leaves/mine', { headers: { Authorization: `Bearer ${token}` } });
        setLeaves(res.data);
      } catch (error) {
        setError('Failed to fetch leave requests.');
        console.error('Failed to fetch leaves', error);
      } finally {
        setLoading(false);
      }
    };

    if(token) fetchLeaves();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-gray-500 text-lg">Loading your leaves...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto py-10 px-6 bg-red-50 border border-red-200 text-red-700 rounded-md">
        {error}
      </div>
    );
  }

  if (leaves.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-10 px-6 text-center text-gray-600">
        You have no leave requests.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-8 text-gray-800 text-center">My Leave Requests</h1>
      <ul className="space-y-6">
        {leaves.map(l => (
          <li
            key={l._id}
            className="bg-white shadow-md rounded-lg p-5 flex flex-col md:flex-row md:justify-between md:items-center border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div className="mb-3 md:mb-0">
              <p className="text-lg font-medium text-gray-900 capitalize">{l.leaveType}</p>
              <p className="text-gray-600">
                {new Date(l.startDate).toLocaleDateString()} to {new Date(l.endDate).toLocaleDateString()}
              </p>
            </div>
            <span
              className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${statusColors[l.status] || 'bg-gray-200 text-gray-700'}`}
            >
              {l.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyLeaves;
