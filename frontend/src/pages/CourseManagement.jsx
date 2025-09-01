import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  addLesson,
  updateLesson,
  deleteLesson,
} from "../api/api";
import CourseForm from "../components/CourseForm";
import LessonForm from "../components/LessonForm";
import toast from "react-hot-toast";
import { Plus, Edit, Trash2, Eye, BookOpen, Users, Clock } from "lucide-react";

const CourseManagement = () => {
  const { token, user, canManageCourses } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [expandedCourse, setExpandedCourse] = useState(null);

  useEffect(() => {
    if (canManageCourses()) {
      fetchCourses();
    }
  }, [token, canManageCourses]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await getCourses(token);
      if (response.success) {
        setCourses(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  // Course CRUD Operations
  const handleCreateCourse = async (courseData) => {
    try {
      const response = await createCourse(courseData, token);
      if (response.success) {
        toast.success("Course created successfully!");
        setShowCourseForm(false);
        fetchCourses();
      }
    } catch (error) {
      toast.error(error.message || "Failed to create course");
    }
  };

  const handleUpdateCourse = async (courseData) => {
    try {
      const response = await updateCourse(editingCourse._id, courseData, token);
      if (response.success) {
        toast.success("Course updated successfully!");
        setShowCourseForm(false);
        setEditingCourse(null);
        fetchCourses();
      }
    } catch (error) {
      toast.error(error.message || "Failed to update course");
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this course? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await deleteCourse(courseId, token);
      if (response.success) {
        toast.success("Course deleted successfully!");
        fetchCourses();
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete course");
    }
  };

  // Lesson CRUD Operations
  const handleCreateLesson = async (lessonData) => {
    try {
      const response = await addLesson(selectedCourseId, lessonData, token);
      if (response.success) {
        toast.success("Lesson added successfully!");
        setShowLessonForm(false);
        setSelectedCourseId(null);
        fetchCourses();
      }
    } catch (error) {
      toast.error(error.message || "Failed to add lesson");
    }
  };

  const handleUpdateLesson = async (lessonData) => {
    try {
      const response = await updateLesson(
        selectedCourseId,
        editingLesson.id,
        lessonData,
        token
      );
      if (response.success) {
        toast.success("Lesson updated successfully!");
        setShowLessonForm(false);
        setEditingLesson(null);
        setSelectedCourseId(null);
        fetchCourses();
      }
    } catch (error) {
      toast.error(error.message || "Failed to update lesson");
    }
  };

  const handleDeleteLesson = async (courseId, lessonId) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) {
      return;
    }

    try {
      const response = await deleteLesson(courseId, lessonId, token);
      if (response.success) {
        toast.success("Lesson deleted successfully!");
        fetchCourses();
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete lesson");
    }
  };

  // Form handlers
  const openCourseForm = (course = null) => {
    setEditingCourse(course);
    setShowCourseForm(true);
  };

  const openLessonForm = (courseId, lesson = null) => {
    setSelectedCourseId(courseId);
    setEditingLesson(lesson);
    setShowLessonForm(true);
  };

  const closeForms = () => {
    setShowCourseForm(false);
    setShowLessonForm(false);
    setEditingCourse(null);
    setEditingLesson(null);
    setSelectedCourseId(null);
  };

  if (!canManageCourses()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 transition-colors duration-500">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You need admin or manager privileges to access course management.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-500">
              Course Management
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1 transition-colors duration-500">
              Create and manage your courses and lessons
            </p>
          </div>

          <button
            onClick={() => openCourseForm()}
            className="bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 dark:hover:bg-purple-600 transition-colors duration-300 font-medium flex items-center gap-2 shadow-md"
          >
            <Plus className="w-5 h-5" />
            New Course
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white/80 dark:bg-gray-900/90 rounded-xl p-6 shadow-2xl animate-pulse border border-gray-200 dark:border-gray-700 backdrop-blur-md transition-colors duration-500"
              >
                <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded mb-4 transition-colors duration-500"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded mb-2 transition-colors duration-500"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 transition-colors duration-500"></div>
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white/80 dark:bg-gray-900/90 rounded-2xl p-12 shadow-2xl border border-gray-200 dark:border-gray-700 max-w-md mx-auto backdrop-blur-md transition-colors duration-500">
              <BookOpen className="w-16 h-16 text-gray-400 dark:text-gray-700 mx-auto mb-6 transition-colors duration-500" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 transition-colors duration-500">
                No Courses Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 transition-colors duration-500">
                Start building your curriculum by creating your first course.
              </p>
              <button
                onClick={() => openCourseForm()}
                className="bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 dark:hover:bg-purple-600 transition-colors duration-300 font-medium shadow-md"
              >
                Create Your First Course
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {courses.map((course) => (
              <CourseManagementCard
                key={course._id}
                course={course}
                isExpanded={expandedCourse === course._id}
                onToggleExpand={() =>
                  setExpandedCourse(
                    expandedCourse === course._id ? null : course._id
                  )
                }
                onEditCourse={() => openCourseForm(course)}
                onDeleteCourse={() => handleDeleteCourse(course._id)}
                onAddLesson={() => openLessonForm(course._id)}
                onEditLesson={(lesson) => openLessonForm(course._id, lesson)}
                onDeleteLesson={(lessonId) =>
                  handleDeleteLesson(course._id, lessonId)
                }
              />
            ))}
          </div>
        )}

        {/* Course Form Modal */}
        {showCourseForm && (
          <CourseForm
            course={editingCourse}
            onSave={editingCourse ? handleUpdateCourse : handleCreateCourse}
            onCancel={closeForms}
          />
        )}

        {/* Lesson Form Modal */}
        {showLessonForm && (
          <LessonForm
            lesson={editingLesson}
            onSave={editingLesson ? handleUpdateLesson : handleCreateLesson}
            onCancel={closeForms}
          />
        )}
      </div>
    </div>
  );
};

const CourseManagementCard = ({
  course,
  isExpanded,
  onToggleExpand,
  onEditCourse,
  onDeleteCourse,
  onAddLesson,
  onEditLesson,
  onDeleteLesson,
}) => {
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

  return (
    <div className="bg-white/80 dark:bg-gray-900/90 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden backdrop-blur-md transition-colors duration-500">
      {/* Course Header */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-start justify-between">
          <div className="flex-grow">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-500">
                {course.title}
              </h3>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                  course.difficulty
                )} dark:bg-opacity-80 dark:text-opacity-90 transition-colors duration-500`}
              >
                {course.difficulty || "Beginner"}
              </span>
              {!course.isPublished && (
                <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-300 rounded-full text-xs font-medium transition-colors duration-500">
                  Draft
                </span>
              )}
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 transition-colors duration-500">
              {course.description}
            </p>

            <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-500">
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>{course.lessons?.length || 0} lessons</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{course.enrolledCount || 0} students</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{Math.round(course.estimatedDuration || 0)}h</span>
              </div>
            </div>
          </div>

          {/* Course Actions */}
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={onToggleExpand}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-300"
              title={isExpanded ? "Collapse" : "Expand"}
            >
              <Eye className="w-5 h-5" />
            </button>
            <button
              onClick={onEditCourse}
              className="p-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors duration-300"
              title="Edit Course"
            >
              <Edit className="w-5 h-5" />
            </button>
            <button
              onClick={onDeleteCourse}
              className="p-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors duration-300"
              title="Delete Course"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Lessons Section */}
      {isExpanded && (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-500">
              Lessons
            </h4>
            <button
              onClick={onAddLesson}
              className="bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-purple-600 transition-colors duration-300 font-medium flex items-center gap-2 text-sm shadow-md"
            >
              <Plus className="w-4 h-4" />
              Add Lesson
            </button>
          </div>

          {course.lessons && course.lessons.length > 0 ? (
            <div className="space-y-3">
              {course.lessons.map((lesson, index) => (
                <LessonManagementCard
                  key={lesson.id}
                  lesson={lesson}
                  index={index}
                  onEdit={() => onEditLesson(lesson)}
                  onDelete={() => onDeleteLesson(lesson.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">
                No lessons in this course yet.
              </p>
              <button
                onClick={onAddLesson}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Add First Lesson
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const LessonManagementCard = ({ lesson, index, onEdit, onDelete }) => (
  <div className="bg-white/80 dark:bg-gray-900/90 rounded-lg p-4 border border-gray-200 dark:border-gray-700 flex items-center justify-between backdrop-blur-md transition-colors duration-500">
    <div className="flex items-center gap-4">
      <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-500">
        {index + 1}
      </div>
      <div>
        <h5 className="font-medium text-gray-900 dark:text-white transition-colors duration-500">
          {lesson.title}
        </h5>
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-500">
          {lesson.duration && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {lesson.duration}m
            </span>
          )}
          {lesson.subjectCategory && <span>{lesson.subjectCategory}</span>}
          {lesson.topics && <span>{lesson.topics.length} topics</span>}
        </div>
      </div>
    </div>

    <div className="flex items-center gap-2">
      <button
        onClick={onEdit}
        className="p-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors duration-300"
        title="Edit Lesson"
      >
        <Edit className="w-4 h-4" />
      </button>
      <button
        onClick={onDelete}
        className="p-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors duration-300"
        title="Delete Lesson"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  </div>
);

export default CourseManagement;
