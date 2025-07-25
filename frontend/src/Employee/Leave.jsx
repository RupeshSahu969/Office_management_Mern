import React, { useState } from 'react';
import api from "../Api/Api";
import { useAuth } from '../AuthContext/AuthContext';

const Leave = () => {
  const { token, id } = useAuth();

  // Controlled form states
  const [leaveType, setLeaveType] = useState('sick');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState('Pending'); // status controlled but user can't change it
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!id) {
      setError("Employee ID is missing.");
      setIsSubmitting(false);
      return;
    }

    const leaveData = {
      userId: id,
      leaveType,
      startDate,
      endDate,
      reason,
      status,  // will send "Pending"
    };

    try {
      const res = await api.post('/leaves', leaveData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      console.log('Leave request created:', res.data);
      setIsSubmitting(false);

      // Reset form fields to initial state
      setLeaveType('sick');
      setStartDate('');
      setEndDate('');
      setReason('');
      setStatus('Pending');
    } catch (err) {
      setIsSubmitting(false);
      setError(err.response?.data?.error || 'An error occurred while submitting the leave request.');
      console.error('Error response:', err.response?.data);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Leave Request</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          {/* Leave Type Select */}
          <div>
            <label className="block text-sm font-semibold mb-2">Leave Type</label>
            <select
              value={leaveType}
              onChange={e => setLeaveType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select</option>
              <option value="sick">Sick</option>
              <option value="vacation">Vacation</option>
              <option value="personal">Personal</option>
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-semibold mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-semibold mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Reason Textarea */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Reason</label>
          <textarea
            value={reason}
            onChange={e => setReason(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Status Select (disabled) */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Status</label>
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            disabled
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
          >
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
          <p className="text-sm text-gray-500 mt-1">Status is set by admin and cannot be changed now.</p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Leave Request'}
        </button>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </form>
    </div>
  );
};

export default Leave;
