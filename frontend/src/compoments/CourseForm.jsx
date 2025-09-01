import React, { useState } from "react";

const CourseForm = ({ course, onSave, onCancel }) => {
  const [title, setTitle] = useState(course ? course.title : "");
  const [description, setDescription] = useState(
    course ? course.description : ""
  );
  const [imageUrl, setImageUrl] = useState(course ? course.imageUrl : "");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple validation
    if (!title || !description || !imageUrl) {
      console.error("Please fill in all course fields.");
      // In a full application, replace console.error with a user-friendly modal/notification.
      return;
    }
    onSave({ id: course?.id, title, description, imageUrl });
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-0 w-full max-w-md mx-auto transform transition-all">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-semibold text-gray-900 tracking-tight">
              {course ? "Edit Course" : "Create New Course"}
            </h3>
            <button
              type="button"
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
              aria-label="Close"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {course
              ? "Update your course information"
              : "Fill in the details to create your course"}
          </p>
        </div>

        {/* Form Content */}
        <div className="px-8 py-6 space-y-6">
          {/* Course Title */}
          <div className="space-y-2">
            <label
              htmlFor="courseTitle"
              className="block text-sm font-medium text-gray-700"
            >
              Course Title
            </label>
            <input
              type="text"
              id="courseTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 text-sm"
              placeholder="Enter course title..."
              required
            />
          </div>

          {/* Course Description */}
          <div className="space-y-2">
            <label
              htmlFor="courseDescription"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="courseDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none placeholder:text-gray-400 text-sm"
              placeholder="Describe what students will learn..."
              required
            />
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <label
              htmlFor="courseImageUrl"
              className="block text-sm font-medium text-gray-700"
            >
              Cover Image URL
            </label>
            <input
              type="url"
              id="courseImageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 text-sm"
              placeholder="https://example.com/image.jpg"
              required
            />
            {imageUrl && (
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-2">Preview:</p>
                <div className="w-full h-24 bg-gray-50 rounded-lg border border-gray-100 overflow-hidden">
                  <img
                    src={imageUrl}
                    alt="Course preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  <div className="w-full h-full hidden items-center justify-center text-gray-400 text-sm">
                    Invalid image URL
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t border-gray-50">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500/20 text-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
            >
              {course ? "Update Course" : "Create Course"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseForm;
