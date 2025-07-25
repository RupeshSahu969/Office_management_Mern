import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext/AuthContext";
import api from "../Api/Api";
import { Link } from "react-router-dom";

const HrEmployees = () => {
  const { token } = useAuth();
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await api.get("/hr/employees", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmployees(res.data);
      } catch (err) {
        console.error("Failed to fetch employees", err);
      }
    };

    if (token) fetchEmployees();
  }, [token]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Employees</h2>
      <table className="min-w-full bg-white border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Role</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp._id} className="border-t">
              <td className="p-2">{emp.name}</td>
              <td className="p-2">{emp.email}</td>
              <td className="p-2">{emp.role}</td>
              <td className="p-2">
                <Link
                  to={`/dashboard/hr/tasks/${emp.userId}`}
                  className="btn bg-green-500 text-white px-2 py-1 mr-2"
                >
                  Tasks
                </Link>
                <Link
                  to={`/dashboard/hr/leaves/${emp.userId}`}
                  className="btn bg-blue-500 text-white px-2 py-1 mr-2"
                >
                  Leaves
                </Link>
                <Link
                  to={`/dashboard/hr/attendance/${emp.userId}`}
                  className="btn bg-yellow-500 text-white px-2 py-1"
                >
                  Attendance
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HrEmployees;
