import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext/AuthContext';
import api from "../Api/Api";

const EmployeeForm = () => {
  const { token, id: userId } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    address: "",
    joiningDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [employeeId, setEmployeeId] = useState(null); // to use in PUT request

  // Auto-fetch employee profile on mount
  useEffect(() => {
   const fetchEmployeeProfile = async () => {
  try {
    const res = await api.get("/employees", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const employee = res.data; // it's a single object, not an array
    console.log(employee,"employee")
    setEmployeeId(employee._id);
    setFormData({
      name: employee.name || "",
      email: employee.email || "",
      phone: employee.phone || "",
      department: employee.department || "",
      address: employee.address || "",
      joiningDate: employee.joiningDate?.substring(0, 10) || "",
    });
  } catch (err) {
    console.error("Failed to load employee profile", err);
  }
};


    if (token && userId) {
      fetchEmployeeProfile();
    }
  }, [token, userId]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        userId,
      };

      const res = await api.put(`/employees`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to update employee profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Update Employee Profile</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label>Name</label>
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label>Email (read-only)</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            readOnly
            className="w-full px-4 py-2 border rounded-md bg-gray-100 text-gray-600"
          />
        </div>

        <div>
          <label>Phone</label>
          <input
            name="phone"
            type="text"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        <div>
          <label>Department</label>
          <input
            name="department"
            type="text"
            value={formData.department}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        <div>
          <label>Joining Date</label>
          <input
            name="joiningDate"
            type="date"
            value={formData.joiningDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        <div className="col-span-full">
          <label>Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        <div className="col-span-full mt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </form>

      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
};

export default EmployeeForm;
