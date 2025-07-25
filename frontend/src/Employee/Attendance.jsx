import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext/AuthContext';
import api from '../Api/Api';

const Attendance = () => {
  const { token, id } = useAuth(); // Get the token and id details for authorization

  const [userId, setuserId] = useState('');
  const [date, setDate] = useState('');
  const [inTime, setInTime] = useState('');
  const [outTime, setOutTime] = useState('');
  const [status, setStatus] = useState('present');
  const [totalHours, setTotalHours] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);

  // Function to convert time string to a Date object
  const convertToDateTime = (date, time) => {
    const [hours, minutes] = time.split(':');
    const dateTimeString = `${date}T${hours}:${minutes}:00`; // Format: YYYY-MM-DDTHH:MM:SS
    return new Date(dateTimeString); // Convert the string to a Date object
  };

  // Function to calculate the total hours from inTime and outTime
  const calculateTotalHours = (inTime, outTime) => {
    if (inTime && outTime) {
      const inDateTime = convertToDateTime(date, inTime);
      const outDateTime = convertToDateTime(date, outTime);
      const diffInMs = outDateTime - inDateTime; // Difference in milliseconds
      const hours = diffInMs / (1000 * 60 * 60); // Convert milliseconds to hours
      setTotalHours(hours.toFixed(2)); // Set the total hours with 2 decimal precision
    }
  };

  // Use useEffect to calculate total hours when inTime or outTime changes
  useEffect(() => {
    if (inTime && outTime) {
      calculateTotalHours(inTime, outTime);
    }
  }, [inTime, outTime, date]); // Trigger effect whenever inTime, outTime, or date changes

  // Set current date as the default date
  useEffect(() => {
    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
    setDate(currentDate); // Set the date state to today's date
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    // Convert inTime and outTime to Date objects before sending them to the backend
    const inTimeDate = convertToDateTime(date, inTime);
    const outTimeDate = convertToDateTime(date, outTime);

    const attendanceData = {
      userId: id,
      date,
      inTime: inTimeDate,
      outTime: outTimeDate,
      status,
      totalHours,
    };

    try {
      const res = await api.post('/attendance', attendanceData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Attendance submitted:', res.data);
      setIsSubmitting(false);
      setSuccess('Attendance successfully recorded!');
      setDate('');
      setuserId('');
      setInTime('');
      setOutTime('');
      setStatus('present');
      setTotalHours('');
    } catch (err) {
      setIsSubmitting(false);
      setError(err.response?.data?.error || 'An error occurred while submitting the attendance.');
      console.error('Error response:', err.response?.data);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 border border-gray-200 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-6">Attendance Form</h2>

      {/* Success and Error Messages */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          <strong>Error: </strong> {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
          <strong>Success: </strong> {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Date */}
          <div className="mb-4">
            <label className="block text-gray-700">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* In Time */}
          <div className="mb-4">
            <label className="block text-gray-700">In Time</label>
            <input
              type="time"
              value={inTime}
              onChange={(e) => setInTime(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Out Time */}
          <div className="mb-4">
            <label className="block text-gray-700">Out Time</label>
            <input
              type="time"
              value={outTime}
              onChange={(e) => setOutTime(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Status */}
          <div className="mb-4">
            <label className="block text-gray-700">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md"
            >
              <option>Select</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="half-day">Half-Day</option>
              <option value="leave">Leave</option>
            </select>
          </div>

          {/* Total Hours */}
          <div className="mb-4">
            <label className="block text-gray-700">Total Hours</label>
            <input
              type="number"
              value={totalHours}
              onChange={(e) => setTotalHours(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md"
              readOnly
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="mb-4">
          <button
            type="submit"
            className={`px-6 py-2 rounded-md ${isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Attendance;
