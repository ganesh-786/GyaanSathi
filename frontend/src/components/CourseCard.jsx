import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { enrollInCourse, unenrollFromCourse } from "../api/api";
import toast from "react-hot-toast";
import { Clock, Users, BookOpen, Star } from "lucide-react";

function CourseCard({ course, onViewCourse, onCourseUpdate }) {
  const { user, token, canManageCourses } = useContext(AuthContext);

  const handleEnrollment = async (e) => {
    e.stopPropagation();

    try {
      if (course.isEnrolled) {
        await unenrollFromCourse(course._id, token);
        toast.success("Successfully unenrolled from course");
      } else {
        await enrollInCourse(course._id, token);
        toast.success("Successfully enrolled in course");
      }

      if (onCourseUpdate) {
        onCourseUpdate();
      }
    } catch (error) {
      toast.error(error.message || "Failed to update enrollment");
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "beginner":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "intermediate":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
      case "advanced":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200";
    }
  };

  return (
    <div className="bg-white/80 dark:bg-gray-900/90 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl hover:border-indigo-200 dark:hover:border-indigo-500 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col group backdrop-blur-md">
      {/* Course Image */}
      <div className="relative h-48 overflow-hidden bg-gray-50 dark:bg-gray-800 transition-colors duration-500">
        <img
          src={
            course.imageUrl ||
            `https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop`
          }
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Course Stats */}
        <div className="absolute top-4 right-4 flex gap-2">
          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm border border-white/20 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
              {Array.isArray(course.lessons) ? course.lessons.length : 0}
            </span>
          </div>
          {course.enrolledCount > 0 && (
            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm border border-white/20 dark:border-gray-700">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-1">
                <Users className="w-3 h-3" />
                {course.enrolledCount}
              </span>
            </div>
          )}
        </div>

        {/* Enrollment Status */}
        {user && course.isEnrolled && (
          <div className="absolute top-4 left-4">
            <div className="bg-green-500 dark:bg-green-700 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-md">
              <Star className="w-3 h-3" />
              Enrolled
            </div>
          </div>
        )}
      </div>

      {/* Course Content */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Course Meta */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
              course.difficulty
            )} transition-colors duration-500`}
          >
            {course.difficulty || "Beginner"}
          </span>
          {course.category && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-full text-xs font-medium transition-colors duration-500">
              {course.category}
            </span>
          )}
          {course.estimatedDuration > 0 && (
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-full text-xs font-medium flex items-center gap-1 transition-colors duration-500">
              <Clock className="w-3 h-3" />
              {Math.round(course.estimatedDuration)}h
            </span>
          )}
        </div>

        {/* Course Title */}
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2 leading-tight transition-colors duration-500">
          {course.title}
        </h3>

        {/* Course Description */}
        <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow text-sm leading-relaxed line-clamp-3 transition-colors duration-500">
          {course.description}
        </p>

        {/* Course Creator */}
        {course.createdBy && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-4 transition-colors duration-500">
            Created by {course.createdBy.username}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-auto space-y-2">
          <button
            onClick={() => onViewCourse(course._id)}
            className="w-full bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-purple-600 text-white py-3 px-6 rounded-xl font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:ring-offset-1 shadow-md hover:shadow-xl flex items-center justify-center gap-2 group/btn"
          >
            <span>View Course</span>
            <svg
              className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>

          {/* Enrollment Button for Users */}
          {user && user.role === "user" && course.isPublished && (
            <button
              onClick={handleEnrollment}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-colors text-sm shadow-md ${
                course.isEnrolled
                  ? "bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-200 hover:bg-red-100 dark:hover:bg-red-800 border border-red-200 dark:border-red-700"
                  : "bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-200 hover:bg-green-100 dark:hover:bg-green-800 border border-green-200 dark:border-green-700"
              }`}
            >
              {course.isEnrolled ? "Unenroll" : "Enroll Now"}
            </button>
          )}

          {/* Management Indicator */}
          {canManageCourses() && course.canEdit && (
            <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium text-center transition-colors duration-500">
              You can manage this course
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseCard;
