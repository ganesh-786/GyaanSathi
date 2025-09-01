import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, requiredRole = null, fallback = null }) => {
  const { user, loading, isAuthenticated } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 transition-colors duration-500">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-yellow-400"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 transition-colors duration-500">
          <div className="text-center bg-white/80 dark:bg-gray-900/90 rounded-2xl p-10 shadow-2xl border border-gray-200 dark:border-gray-700 max-w-md mx-auto backdrop-blur-md">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Access Denied
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Please log in to access this page.
            </p>
            <a
              href="/login"
              className="bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-purple-600 transition-colors font-medium shadow-md"
            >
              Go to Login
            </a>
          </div>
        </div>
      )
    );
  }

  if (requiredRole && user.role !== requiredRole && user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 transition-colors duration-500">
        <div className="text-center bg-white/80 dark:bg-gray-900/90 rounded-2xl p-10 shadow-2xl border border-gray-200 dark:border-gray-700 max-w-md mx-auto backdrop-blur-md">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You don't have permission to access this page.
          </p>
          <a
            href="/"
            className="bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-purple-600 transition-colors font-medium shadow-md"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
