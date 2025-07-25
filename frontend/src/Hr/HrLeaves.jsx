import React, { useEffect, useState } from 'react';
import api from "../Api/Api";
import { useAuth } from '../AuthContext/AuthContext';
import { useParams } from 'react-router-dom';

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Approved: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800',
};

const HrLeaves = () => {
 const { token } = useAuth();
  const { id } = useParams(); // get employee id from route params
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const fetchLeaves = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch leaves for the specific employee
        const res = await api.get(`/hr/leaves/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLeaves(res.data);
      } catch (error) {
        setError('Failed to fetch leaves.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (token && id) fetchLeaves();
  }, [token, id]);

  // Handle approve/reject actions
const handleStatusUpdate = async (id, status) => {
  setUpdatingId(id);
  try {
    await api.put(`/hr/leaves/${id}/status`, { status }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setLeaves(leaves.map(l => (l._id === id ? { ...l, status } : l)));
  } catch (err) {
    alert('Failed to update leave status.');
    console.error(err);
  } finally {
    setUpdatingId(null);
  }
};


  if (loading) return <p className="text-center py-20 text-gray-500">Loading leave requests...</p>;
  if (error) return <p className="max-w-xl mx-auto p-6 text-red-600 bg-red-100 rounded">{error}</p>;
  if (leaves.length === 0) return <p className="text-center py-10 text-gray-600">No leave requests found.</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-8 text-gray-800 text-center">HR Leave Management</h1>

      <ul className="space-y-6">
        {leaves.map(l => (
          <li
            key={l._id}
            className="bg-white shadow rounded-lg p-5 flex flex-col md:flex-row md:justify-between md:items-center border border-gray-200"
          >
            <div className="flex-1 mb-4 md:mb-0">
              <p className="text-lg font-semibold text-gray-900 capitalize">{l.leaveType}</p>
              <p className="text-gray-600">
                {new Date(l.startDate).toLocaleDateString()} to {new Date(l.endDate).toLocaleDateString()}
              </p>
              {l.userId && (
                <p className="text-sm text-gray-500 mt-1">
                  Employee: {l.userId.name || l.userId.email || 'Unknown'}
                </p>
              )}
              {l.reason && (
                <p className="mt-2 text-gray-700 italic">Reason: {l.reason}</p>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <span
                className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${statusColors[l.status] || 'bg-gray-200 text-gray-700'}`}
              >
                {l.status}
              </span>

              {l.status === 'Pending' && (
                <>
                  <button
                    onClick={() => handleStatusUpdate(l._id, 'Approved')}
                    disabled={updatingId === l._id}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-green-300 transition"
                  >
                    {updatingId === l._id ? 'Updating...' : 'Approve'}
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(l._id, 'Rejected')}
                    disabled={updatingId === l._id}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-red-300 transition"
                  >
                    {updatingId === l._id ? 'Updating...' : 'Reject'}
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HrLeaves;
