import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { BookOpen, User, Settings, LogOut, Home } from "lucide-react";

const Navbar = () => {
  const { user, logout, isAuthenticated, canManageCourses } =
    useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 shadow-lg border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40 backdrop-blur-md transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-xl font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-purple-400 transition-colors"
          >
            <BookOpen className="w-8 h-8" />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-500 bg-clip-text text-transparent">
              GyaanSathi
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className="flex items-center space-x-1 text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-purple-400 transition-colors font-medium"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>

            {!isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-purple-400 transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-purple-600 transition-colors font-medium shadow-md"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                {/* User Info */}
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{user.username}</span>
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-full text-xs font-medium capitalize border border-gray-200 dark:border-gray-700">
                    {user.role}
                  </span>
                </div>

                {/* Management Link for Admin/Manager */}
                {canManageCourses() && (
                  <Link
                    to="/manage"
                    className="flex items-center space-x-1 text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-purple-400 transition-colors font-medium"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Manage</span>
                  </Link>
                )}

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400 transition-colors font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
