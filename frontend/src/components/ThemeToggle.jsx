import React, { useEffect, useState } from "react";

// Sun and Moon SVG icons for toggle button
const SunIcon = () => (
  <svg
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className="w-6 h-6"
  >
    <circle cx="12" cy="12" r="5" strokeWidth="2" />
    <path
      strokeWidth="2"
      d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 7.07l-1.41-1.41M6.46 6.46L5.05 5.05m12.02 0l-1.41 1.41M6.46 17.54l-1.41 1.41"
    />
  </svg>
);
const MoonIcon = () => (
  <svg
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path strokeWidth="2" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
  </svg>
);

const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "light";
    }
    return "light";
  });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-2xl bg-white/80 dark:bg-gray-900/90 border-2 border-gray-300 dark:border-yellow-400 backdrop-blur-md transition-all duration-500 hover:bg-gray-100 dark:hover:bg-yellow-500/20 hover:scale-105"
      aria-label="Toggle dark mode"
      title="Toggle dark/light mode"
      style={{ boxShadow: "0 8px 32px 0 rgba(255, 221, 51, 0.37)" }}
    >
      {theme === "dark" ? (
        <SunIcon color="#FFD700" />
      ) : (
        <MoonIcon color="#1e293b" />
      )}
    </button>
  );
};

export default ThemeToggle;
