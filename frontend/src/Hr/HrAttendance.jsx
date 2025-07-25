import React, { useEffect, useState } from "react";
import api from "../Api/Api";
import { useAuth } from "../AuthContext/AuthContext";
import { useParams } from "react-router-dom";

const HrAttendance = () => {
  const { token } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page
const { id } = useParams();

 useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get(`/hr/attendance/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setAttendance(res.data);
      } catch (err) {
        console.error("Error:", err.response?.data || err.message);
      }
    };

    if (token && id) {
      fetchTasks();
    }
  }, [token, id]);

  // Paginate the attendance records
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate the index for the current page
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentAttendance = attendance.slice(indexOfFirst, indexOfLast);

  return (
    <div className="max-w-7xl mx-auto my-8 p-4">
      <h2 className="text-2xl font-semibold text-center mb-6">HR Attendance Records</h2>

      {/* Table to display attendance data */}
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full table-auto text-sm text-left text-gray-500">
          <thead className="bg-blue-600 text-white">
            <tr>
              {/* <th className="px-4 py-3">Employee ID</th> */}
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">In Time</th>
              <th className="px-4 py-3">Out Time</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Total Hours</th>
            </tr>
          </thead>
          <tbody>
            {currentAttendance.length > 0 ? (
              currentAttendance.map((attendanceRecord) => (
                <tr key={attendanceRecord._id} className="border-b hover:bg-gray-50">
                  {/* <td className="px-4 py-3">{attendanceRecord.employeeId}</td> */}
                  <td className="px-4 py-3">{new Date(attendanceRecord.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{new Date(attendanceRecord.inTime).toLocaleTimeString()}</td>
                  <td className="px-4 py-3">{new Date(attendanceRecord.outTime).toLocaleTimeString()}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-white ${
                        attendanceRecord.status === "Present"
                          ? "bg-green-500"
                          : attendanceRecord.status === "Absent"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      {attendanceRecord.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{attendanceRecord.totalHours.toFixed(2)} hours</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center px-4 py-3">
                  No attendance records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6">
        <nav className="inline-flex items-center space-x-2">
          {[...Array(Math.ceil(attendance.length / itemsPerPage))].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                index + 1 === currentPage
                  ? "bg-blue-600 text-white"
                  : "bg-white text-blue-600 hover:bg-blue-100"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default HrAttendance;
