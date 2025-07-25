import React, { useState } from "react";
import { FaSearch, FaBell, FaUserCircle, FaBars, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";

const Header = ({ toggleSidebar }) => {
  const { email, logout, isAuthenticated } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md h-16 flex items-center justify-between px-4">
      <div className="flex items-center">
        {/* Hamburger on small screens */}
        <button className="text-2xl md:hidden mr-4" onClick={toggleSidebar}>
          <FaBars />
        </button>
        <h1 className="text-lg font-semibold">Admin Panel</h1>
      </div>

      <div className="flex items-center space-x-4">
        <FaSearch className="hidden sm:inline" />
        <FaBell className="hidden sm:inline" />

        {isAuthenticated && (
          <div className="relative">
            <button onClick={() => setIsProfileOpen(!isProfileOpen)}>
              <FaUserCircle className="text-2xl" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-md border rounded-md p-2 z-50">
                <p className="text-sm text-gray-800 mb-2">{email}</p>
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-red-500 hover:bg-gray-100 p-2 rounded-md"
                >
                  <FaSignOutAlt className="inline mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
