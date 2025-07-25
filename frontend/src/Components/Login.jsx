import { useState } from "react";
import { useAuth } from "../AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../Api/Api"; // Assuming api is correctly set up for requests

const Login = () => {
  const { login } = useAuth(); // Custom hook for authentication
  const [email, setEmail] = useState(""); // Corrected state name
  const [password, setPassword] = useState(""); // Corrected state name
  const [error, setError] = useState(""); // State for error handling
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    const data = { email, password }; // Combine email and password into one object

    try {
      // Make the API request to login the user
      const res = await api.post("/auth/login", data);

      // Log the response for debugging
      console.log("API Response: ", res.data);

      const { token, email, id, role, username } = res.data;

      if (token) {
        // Call the login function from context to store the user data
        login(token, email, username, role, id);

        // Redirect to the dashboard after successful login
        navigate("/dashboard");
      } else {
        // Set error if no token in response
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      // Log the error and show a general error message
      console.error("Login error:", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <form className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm" onSubmit={handleSubmit}>
        <h2 className="text-3xl font-semibold text-center mb-6">Login</h2>
        
        {/* Error message display */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Email Input */}
        <div className="mb-4">
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Corrected setter function
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Password Input */}
        <div className="mb-6">
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Corrected setter function
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
        >
          Login
        </button>

        {/* Links for forgot password and registration */}
        <div className="flex justify-between mt-4 text-sm text-gray-600">
          <a href="/forgot-password" className="hover:text-blue-600">Forgot Password?</a>
          <a href="/register" className="hover:text-blue-600">Create an Account</a>
        </div>
      </form>
    </div>
  );
};

export default Login;
