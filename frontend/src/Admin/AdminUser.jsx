import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext/AuthContext";
import api from "../Api/Api";
import { MdDelete } from "react-icons/md";

const AdminUser = () => {
  const { token } = useAuth();
  const [user, setuser] = useState([]);

  useEffect(() => {
    const fetchuser = async () => {
      try {
        const res = await api.get("/admin/users", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setuser(res.data);
        console.log(res.data);
      } catch (err) {
        console.error("Error:", err.response?.data || err.message);
      }
    };

    if (token) {
      fetchuser();
    }
  }, [token]);

  const handleDelete = async (id) => {
    try {
      // Send DELETE request to API
      const res = await api.delete(`/admin/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // If delete is successful, filter out the deleted user from the state
      setuser(user.filter((emp) => emp._id !== id));
      console.log("User deleted:", res.data);
    } catch (err) {
      console.error("Error deleting user:", err.response?.data || err.message);
    }
  };

  // Function to handle the export (download Excel file)
 const handleExport = async () => {
  try {
    const res = await api.get("/admin/export-users", {
      headers: {
        Authorization: `Bearer ${token}`
        // ✅ DO NOT set "Content-Type" when downloading files
      },
      responseType: "blob", // Important for binary files
    });

    const fileURL = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = fileURL;
    link.setAttribute("download", "user.xlsx"); // File name
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

      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b text-left">Username</th>
              <th className="py-2 px-4 border-b text-left">Email</th>
              <th className="py-2 px-4 border-b text-left">Role</th>
              <th className="py-2 px-4 border-b text-left">Created At</th>
              <th className="py-2 px-4 border-b text-left">Updated At</th>
              <th className="py-2 px-4 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {user.map((emp) => (
              <tr key={emp._id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{emp.username}</td>
                <td className="py-2 px-4 border-b">{emp.email}</td>
                <td className="py-2 px-4 border-b">{emp.role}</td>
                <td className="py-2 px-4 border-b">{emp.createdAt}</td>
                <td className="py-2 px-4 border-b">{emp.updatedAt}</td>
                <td className="py-2 px-4 border-b">
                  <MdDelete
                    className="text-red-600 cursor-pointer"
                    onClick={() => handleDelete(emp._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUser;
