import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext/AuthContext";
import api from "../Api/Api";

const AdminEmployee = () => {
  const { token } = useAuth(); 
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true); // For loading state
  const [error, setError] = useState(""); // For error messages

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await api.get("/admin/employees", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setEmployees(res.data);  // Ensure only employee data is retrieved
      } catch (err) {
        setError("Failed to load employees");
        console.error("Error:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchEmployees();
    }
  }, [token]);

const handleExport = async () => {
  try {
    const res = await api.get("/admin/export-employee", {
      headers: {
        Authorization: `Bearer ${token}`
        // ✅ DO NOT set "Content-Type" when downloading files
      },
      responseType: "blob", // Important for binary files
    });

    const fileURL = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = fileURL;
    link.setAttribute("download", "Employee.xlsx"); // File name
    document.body.appendChild(link);
    link.click(); // Trigger the download
    document.body.removeChild(link);
  } catch (err) {
    console.error("Error downloading Excel:", err);
  }
};



  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">All Users</h2>
        {/* Export Button */}
        <button
          onClick={handleExport}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md"
        >
          Download Excel
        </button>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b text-left">Name</th>
                <th className="py-2 px-4 border-b text-left">Email</th>
                <th className="py-2 px-4 border-b text-left">Role</th>
                <th className="py-2 px-4 border-b text-left">Projects</th>
                <th className="py-2 px-4 border-b text-left">Phone</th>
                <th className="py-2 px-4 border-b text-left">Joining Date</th>
                <th className="py-2 px-4 border-b text-left">Address</th>
 
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{emp.name}</td>
                  <td className="py-2 px-4 border-b">{emp.email}</td>
                  <td className="py-2 px-4 border-b">{emp.role}</td>
                  <td className="py-2 px-4 border-b">
                    {emp.projects?.length > 0
                      ? emp.projects.map((p) => p.name).join(", ")
                      : "N/A"}
                  </td>
                  <td className="py-2 px-4 border-b">{emp.phone}</td>
                  <td className="py-2 px-4 border-b">
                    {new Date(emp.joiningDate).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b">{emp.address}</td>
                  <td className="py-2 px-4 border-b">
                    {/* Add any action buttons or links here */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminEmployee;
