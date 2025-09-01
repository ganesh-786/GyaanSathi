import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getCourses } from "../api/api";
import CourseCard from "../components/CourseCard";
import toast from "react-hot-toast";
import { BookOpen, Users, Award, TrendingUp } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";

const Homepage = () => {
  const { user, token, isAuthenticated } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    difficulty: "all",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, [token, filters]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.category !== "all") params.category = filters.category;
      if (filters.difficulty !== "all") params.difficulty = filters.difficulty;

      const response = await getCourses(token, params);
      if (response.success) {
        setCourses(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      if (isAuthenticated) {
        toast.error("Failed to load courses");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleViewCourse = (courseId) => {
    if (!isAuthenticated) {
      toast.error("Please login to view course details");
      navigate("/login");
      return;
    }
    navigate(`/courses/${courseId}`);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-500">
        {/* Hero Section */}
        <section className="relative py-10 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-block p-8 rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 shadow-2xl mb-8 transition-colors duration-500">
              <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6 transition-colors duration-500">
                Welcome to{" "}
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  GyaanSathi
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed transition-colors duration-500">
                Discover expertly crafted courses and accelerate your learning
                journey with our comprehensive platform
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="flex justify-center gap-6 flex-wrap">
              <FeatureBadge
                icon={Users}
                label="Expert Instructors"
                color="emerald"
              />
              <FeatureBadge
                icon={BookOpen}
                label="Interactive Learning"
                color="violet"
              />
              <FeatureBadge icon={Award} label="Certificates" color="amber" />
              <FeatureBadge
                icon={TrendingUp}
                label="Progress Tracking"
                color="blue"
              />
            </div>
          </div>
        </section>

        {/* Filters Section */}
        {isAuthenticated && (
          <section className="py-8 px-6 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md transition-colors duration-500">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-500">
                  Available Courses
                </h2>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={filters.search}
                    onChange={(e) =>
                      handleFilterChange("search", e.target.value)
                    }
                    className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-500"
                  />

                  <select
                    value={filters.category}
                    onChange={(e) =>
                      handleFilterChange("category", e.target.value)
                    }
                    className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-500"
                  >
                    <option value="all">All Categories</option>
                    <option value="Programming">Programming</option>
                    <option value="Design">Design</option>
                    <option value="Business">Business</option>
                    <option value="Marketing">Marketing</option>
                  </select>

                  <select
                    value={filters.difficulty}
                    onChange={(e) =>
                      handleFilterChange("difficulty", e.target.value)
                    }
                    className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-500"
                  >
                    <option value="all">All Levels</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Courses Section */}
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto">
            {!isAuthenticated ? (
              <div className="text-center py-16">
                <div className="bg-white/80 dark:bg-gray-900/80 rounded-2xl p-12 shadow-2xl border border-gray-200 dark:border-gray-700 max-w-md mx-auto backdrop-blur-md transition-colors duration-500">
                  <BookOpen className="w-16 h-16 text-indigo-600 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Start Your Learning Journey
                  </h3>
                  <p className="text-gray-600 mb-8">
                    Join thousands of learners and access our premium courses
                  </p>
                  <div className="space-y-3">
                    <Link
                      to="/register"
                      className="block w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                    >
                      Get Started
                    </Link>
                    <Link
                      to="/login"
                      className="block w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Already have an account?
                    </Link>
                  </div>
                </div>
              </div>
            ) : loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white/80 dark:bg-gray-900/80 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 animate-pulse backdrop-blur-md transition-colors duration-500"
                  >
                    <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {courses.map((course) => (
                  <CourseCard
                    key={course._id}
                    course={course}
                    onViewCourse={handleViewCourse}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="bg-white/80 dark:bg-gray-900/80 rounded-2xl p-12 shadow-2xl border border-gray-200 dark:border-gray-700 max-w-md mx-auto backdrop-blur-md transition-colors duration-500">
                  <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    No Courses Found
                  </h3>
                  <p className="text-gray-600">
                    {filters.search ||
                    filters.category !== "all" ||
                    filters.difficulty !== "all"
                      ? "Try adjusting your filters to find more courses."
                      : "No courses are available yet. Check back later!"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md transition-colors duration-500">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <StatCard
                number="10K+"
                label="Active Learners"
                color="text-emerald-600"
              />
              <StatCard
                number="500+"
                label="Expert Courses"
                color="text-blue-600"
              />
              <StatCard
                number="95%"
                label="Success Rate"
                color="text-purple-600"
              />
              <StatCard number="24/7" label="Support" color="text-orange-600" />
            </div>
          </div>
        </section>
      </div>
      <ThemeToggle />
    </>
  );
};

const FeatureBadge = ({ icon: Icon, label, color }) => {
  const colorMap = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    violet: "bg-violet-50 text-violet-700 border-violet-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
  };

  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${colorMap[color]}`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </div>
  );
};

const StatCard = ({ number, label, color }) => (
  <div className="bg-white/80 dark:bg-gray-900/80 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 backdrop-blur-md transition-colors duration-500">
    <div
      className={`text-3xl font-bold ${color} mb-2 transition-colors duration-500`}
    >
      {number}
    </div>
    <div className="text-gray-600 dark:text-gray-300 font-medium transition-colors duration-500">
      {label}
    </div>
  </div>
);

export default Homepage;
