import React, { useState } from "react";
import { FaTachometerAlt, FaUsers, FaCog, FaChartBar } from 'react-icons/fa';
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext";

const Sidebar = () => {
  const { role, isAuthenticated } = useAuth();
  const [isHrMenuOpen, setIsHrMenuOpen] = useState(true); // Expand HR menu by default
  const [isEmployeeMenuOpen, setIsEmployeeMenuOpen] = useState(true); // Expand Employee menu by default

  if (!isAuthenticated) return null;

  return (
    <div className="h-full w-64 bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold text-center mb-6">Admin Panel</h2>
      <nav>
        <ul>
          <li className="mb-4">
            <Link to="/dashboard" className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md">
              <FaTachometerAlt /> <span>Dashboard</span>
            </Link>
          </li>

          {/* Admin Section */}
          {role === "admin" && (
            <>
              <li className="mb-4">
                <Link to="/dashboard/register" className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md">
                  <FaUsers /> <span>Register</span>
                </Link>
              </li>
              <li className="mb-4">
                <Link to="/dashboard/admin/employee" className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md">
                  <FaUsers /> <span>Employee</span>
                </Link>
              </li>
              <li className="mb-4">
                <Link to="/dashboard/admin/users" className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md">
                  <FaUsers /> <span>Users</span>
                </Link>
              </li>
               <li className="mb-4">
                <Link to="/dashboard/admin/project" className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md">
                  <FaUsers /> <span>Project</span>
                </Link>
              </li>
            </>
          )}

          {/* HR Section */}
          {role === "hr" && (
            <>
              <li className="mb-2">
                <button onClick={() => setIsHrMenuOpen(!isHrMenuOpen)} className="flex items-center space-x-2 w-full hover:bg-gray-700 p-2 rounded-md text-left">
                  <FaUsers /> <span>HR Dashboard</span>
                </button>
              </li>
             <li>
                    <Link to="/dashboard/hr/project" className="block p-2 hover:bg-gray-700 rounded-md">Project</Link>
                  </li>
            </>
          )}

          {/* Employee Section */}
          {role === "employee" && (
            <>
              <li className="mb-2">
                <button onClick={() => setIsEmployeeMenuOpen(!isEmployeeMenuOpen)} className="flex items-center space-x-2 w-full hover:bg-gray-700 p-2 rounded-md text-left">
                  <FaUsers /> <span>Employee Section</span>
                </button>
              </li>
              {isEmployeeMenuOpen && (
                <>
                  <li>
                    <Link to="/dashboard/employee" className="block p-2 hover:bg-gray-700 rounded-md">Employee Form</Link>
                  </li>
                  <li>
                    <Link to="/dashboard/leave" className="block p-2 hover:bg-gray-700 rounded-md">Leave</Link>
                  </li>
                  <li>
                    <Link to="/dashboard/attendance" className="block p-2 hover:bg-gray-700 rounded-md">Attendance</Link>
                  </li>
                  <li>
                    <Link to="/dashboard/task" className="block p-2 hover:bg-gray-700 rounded-md">Tasks</Link>
                  </li>
                   <li>
                    <Link to="/dashboard/my-leaves" className="block p-2 hover:bg-gray-700 rounded-md">My leaves</Link>
                  </li>
                   <li>
                    <Link to="/dashboard/project" className="block p-2 hover:bg-gray-700 rounded-md">Project</Link>
                  </li>
                </>
              )}
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
