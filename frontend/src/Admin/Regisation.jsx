import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext";
import api from "../Api/Api";

const Register = () => {
  const { token } = useAuth();
  const [username, setUser] = useState("");
  const [email, setEMail] = useState("");
  const [password, setpassword] = useState("");
  const [role, setRole] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); // Success message state
  const [formData, setFormData] = useState({ username: "", email: "", password: "", role: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null); // Reset success message

    const data = { username, email, password, role };

    try {
      const res = await api.post('/auth/register', data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // If registration is successful, set success message and clear the form
      setSuccessMessage('User successfully registered!');
      setFormData({ username: "", email: "", password: "", role: "" }); // Clear the form
      setIsSubmitting(false);

      console.log('User created:', res.data);
    } catch (err) {
      setIsSubmitting(false);

      if (err.response) {
        // Server responded with an error
        console.error('Error response:', err.response.data);
        setError(`Error: ${err.response.data.message}`);
      } else {
        // No response, maybe network error
        console.error('Error message:', err.message);
        setError("Registration failed. Please try again later.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Employee Registration</h2>

        {/* Success Message */}
        {successMessage && (
          <div className="text-green-600 mb-4">{successMessage}</div>
        )}

        {/* Error Message */}
        {error && (
          <div className="text-red-600 mb-4">{error}</div>
        )}

        {/* Username Input */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Username</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUser(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEMail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Password Input */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Role Select */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Role</label>
          <select
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select</option>
            <option value="employee">Employee</option>
            <option value="hr">HR</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
        >
          {isSubmitting ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;
