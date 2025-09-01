import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getCourseById, enrollInCourse, unenrollFromCourse } from "../api/api";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Clock,
  Users,
  BookOpen,
  Play,
  Star,
  Award,
} from "lucide-react";

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user, token, canManageCourses } = useContext(AuthContext);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourse();
  }, [courseId, token]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const response = await getCourseById(courseId, token);
      if (response.success) {
        setCourse(response.data);
      } else {
        toast.error("Course not found");
        navigate("/");
      }
    } catch (error) {
      console.error("Failed to fetch course:", error);
      toast.error("Failed to load course details");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollment = async () => {
    try {
      if (course.isEnrolled) {
        await unenrollFromCourse(courseId, token);
        toast.success("Successfully unenrolled from course");
      } else {
        await enrollInCourse(courseId, token);
        toast.success("Successfully enrolled in course");
      }
      fetchCourse(); // Refresh course data
    } catch (error) {
      toast.error(error.message || "Failed to update enrollment");
    }
  };

  const handleViewLesson = (lessonId) => {
    navigate(`/courses/${courseId}/lessons/${lessonId}`);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-500">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-yellow-400"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-500">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Course Not Found
          </h2>
          <button
            onClick={() => navigate("/")}
            className="bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-purple-600 transition-colors duration-300"
          >
            Back to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-purple-400 transition-colors mb-8 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Courses
        </button>

        {/* Course Header */}
        <div className="bg-white/80 dark:bg-gray-900/90 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-8 backdrop-blur-md transition-colors duration-500">
          <div className="flex flex-col lg:flex-row">
            {/* Course Image */}
            <div className="lg:w-1/3">
              <img
                src={
                  course.imageUrl ||
                  `https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop`
                }
                alt={course.title}
                className="w-full h-64 lg:h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop`;
                }}
              />
            </div>

            {/* Course Info */}
            <div className="lg:w-2/3 p-8">
              <div className="flex flex-wrap gap-2 mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(
                    course.difficulty
                  )} dark:bg-opacity-80 dark:text-opacity-90 transition-colors duration-500`}
                >
                  {course.difficulty || "Beginner"}
                </span>
                {course.category && (
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-full text-sm font-medium transition-colors duration-500">
                    {course.category}
                  </span>
                )}
                {course.isEnrolled && (
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm font-medium flex items-center gap-1 transition-colors duration-500">
                    <Star className="w-3 h-3" />
                    Enrolled
                  </span>
                )}
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-500">
                {course.title}
              </h1>

              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6 transition-colors duration-500">
                {course.description}
              </p>

              {/* Course Stats */}
              <div className="flex flex-wrap gap-6 mb-6 text-sm text-gray-600 dark:text-gray-300 transition-colors duration-500">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>{course.lessons?.length || 0} lessons</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{Math.round(course.estimatedDuration || 0)} hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{course.enrolledCount || 0} students</span>
                </div>
                {course.createdBy && (
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    <span>By {course.createdBy.username}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                {user?.role === "user" && course.isPublished && (
                  <button
                    onClick={handleEnrollment}
                    disabled={false}
                    className={`px-6 py-3 rounded-xl font-medium transition-colors duration-300 shadow-md ${
                      course.isEnrolled
                        ? "bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-800 text-white"
                        : "bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-800 text-white"
                    }`}
                  >
                    {course.isEnrolled ? "Unenroll" : "Enroll Now"}
                  </button>
                )}

                {canManageCourses() && course.canEdit && (
                  <button
                    onClick={() => navigate("/manage")}
                    className="px-6 py-3 bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-purple-600 text-white rounded-xl font-medium transition-colors duration-300 shadow-md"
                  >
                    Manage Course
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Course Lessons */}
        <div className="bg-white/80 dark:bg-gray-900/90 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8 backdrop-blur-md transition-colors duration-500">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3 transition-colors duration-500">
            <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Course Lessons
          </h2>

          {course.lessons && course.lessons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {course.lessons.map((lesson, index) => (
                <LessonCard
                  key={lesson.id || lesson._id}
                  lesson={lesson}
                  index={index}
                  onViewLesson={handleViewLesson}
                  canAccess={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Lessons Yet
              </h3>
              <p className="text-gray-600">
                {canManageCourses() && course.canEdit
                  ? "Start building your course by adding lessons in the management panel."
                  : "This course doesn't have any lessons yet. Check back later!"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const LessonCard = ({ lesson, index, onViewLesson, canAccess }) => {
  const handleClick = () => {
    if (canAccess) {
      onViewLesson(lesson.id);
    } else {
      toast.error("Please enroll in the course to access lessons");
    }
  };

  return (
    <div
      className={`bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-100 dark:border-gray-700 transition-all duration-200 ${
        canAccess
          ? "hover:shadow-md hover:bg-white dark:hover:bg-gray-800 cursor-pointer"
          : "opacity-60"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-500">
          {index + 1}
        </div>
        <div className="flex-grow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-500">
            {lesson.title}
          </h3>

          {lesson.topics && lesson.topics.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {lesson.topics.slice(0, 3).map((topic, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-md text-xs transition-colors duration-500"
                >
                  {topic}
                </span>
              ))}
              {lesson.topics.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-md text-xs transition-colors duration-500">
                  +{lesson.topics.length - 3} more
                </span>
              )}
            </div>
          )}

          {lesson.duration && (
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-3 transition-colors duration-500">
              <Clock className="w-3 h-3" />
              <span>{lesson.duration} minutes</span>
            </div>
          )}

          <button
            onClick={handleClick}
            disabled={!canAccess}
            className={`flex items-center gap-2 text-sm font-medium transition-colors duration-300 ${
              canAccess
                ? "text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-purple-400"
                : "text-gray-400 dark:text-gray-600 cursor-not-allowed"
            }`}
          >
            <Play className="w-4 h-4" />
            {canAccess ? "Start Lesson" : "Enroll to Access"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
