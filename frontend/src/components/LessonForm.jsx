import React, { useState } from "react";
import { X } from "lucide-react";

const LessonForm = ({ lesson, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    id: lesson?.id || "",
    title: lesson?.title || "",
    materials: lesson?.materials?.join(", ") || "",
    topics: lesson?.topics?.join(", ") || "",
    subjectCategory: lesson?.subjectCategory || "",
    duration: lesson?.duration || "",
    videoUrl: lesson?.videoUrl || "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.id.trim()) {
      newErrors.id = "Lesson ID is required";
    }

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length > 200) {
      newErrors.title = "Title must be less than 200 characters";
    }

    if (!formData.materials.trim()) {
      newErrors.materials = "At least one material is required";
    }

    if (!formData.topics.trim()) {
      newErrors.topics = "At least one topic is required";
    }

    if (!formData.subjectCategory.trim()) {
      newErrors.subjectCategory = "Subject category is required";
    }

    if (
      formData.duration &&
      (isNaN(formData.duration) || formData.duration < 0)
    ) {
      newErrors.duration = "Duration must be a positive number";
    }

    if (formData.videoUrl && !/^https?:\/\/.+/.test(formData.videoUrl)) {
      newErrors.videoUrl = "Please enter a valid URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const lessonData = {
      id: formData.id.trim(),
      title: formData.title.trim(),
      materials: formData.materials
        .split(",")
        .map((m) => m.trim())
        .filter((m) => m),
      topics: formData.topics
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t),
      subjectCategory: formData.subjectCategory.trim(),
      duration: formData.duration ? parseInt(formData.duration) : undefined,
      videoUrl: formData.videoUrl.trim() || undefined,
    };

    onSave(lessonData);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/90 dark:bg-gray-900/95 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto transition-colors duration-500">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 rounded-t-2xl transition-colors duration-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {lesson ? "Edit Lesson" : "Create New Lesson"}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                {lesson
                  ? "Update your lesson details"
                  : "Fill in the information to create your lesson"}
              </p>
            </div>
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Lesson ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Lesson ID *
            </label>
            <input
              type="text"
              value={formData.id}
              onChange={(e) => handleChange("id", e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
                errors.id
                  ? "border-red-300 dark:border-red-700"
                  : "border-gray-300 dark:border-gray-700"
              }`}
              placeholder="e.g., lesson-1, intro, basics..."
              disabled={!!lesson} // Don't allow editing ID for existing lessons
            />
            {errors.id && (
              <p className="text-red-500 text-sm mt-1">{errors.id}</p>
            )}
            {lesson && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Lesson ID cannot be changed after creation
              </p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Lesson Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
                errors.title
                  ? "border-red-300 dark:border-red-700"
                  : "border-gray-300 dark:border-gray-700"
              }`}
              placeholder="Enter lesson title..."
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Materials */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Learning Materials *
            </label>
            <textarea
              value={formData.materials}
              onChange={(e) => handleChange("materials", e.target.value)}
              rows="3"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
                errors.materials
                  ? "border-red-300 dark:border-red-700"
                  : "border-gray-300 dark:border-gray-700"
              }`}
              placeholder="Enter materials separated by commas..."
            />
            {errors.materials && (
              <p className="text-red-500 text-sm mt-1">{errors.materials}</p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Separate multiple materials with commas
            </p>

            {formData.materials && !errors.materials && (
              <div className="mt-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Preview (
                  {formData.materials.split(",").filter((m) => m.trim()).length}{" "}
                  items):
                </p>
                <div className="flex flex-wrap gap-1">
                  {formData.materials
                    .split(",")
                    .filter((m) => m.trim())
                    .slice(0, 3)
                    .map((material, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-md text-xs"
                      >
                        {material.trim().length > 20
                          ? material.trim().substring(0, 20) + "..."
                          : material.trim()}
                      </span>
                    ))}
                  {formData.materials.split(",").filter((m) => m.trim())
                    .length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-300 rounded-md text-xs">
                      +
                      {formData.materials.split(",").filter((m) => m.trim())
                        .length - 3}{" "}
                      more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Topics */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Topics Covered *
            </label>
            <textarea
              value={formData.topics}
              onChange={(e) => handleChange("topics", e.target.value)}
              rows="3"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
                errors.topics
                  ? "border-red-300 dark:border-red-700"
                  : "border-gray-300 dark:border-gray-700"
              }`}
              placeholder="Enter topics separated by commas..."
            />
            {errors.topics && (
              <p className="text-red-500 text-sm mt-1">{errors.topics}</p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Separate multiple topics with commas
            </p>

            {formData.topics && !errors.topics && (
              <div className="mt-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Preview (
                  {formData.topics.split(",").filter((t) => t.trim()).length}{" "}
                  topics):
                </p>
                <div className="flex flex-wrap gap-1">
                  {formData.topics
                    .split(",")
                    .filter((t) => t.trim())
                    .slice(0, 4)
                    .map((topic, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-md text-xs"
                      >
                        {topic.trim().length > 15
                          ? topic.trim().substring(0, 15) + "..."
                          : topic.trim()}
                      </span>
                    ))}
                  {formData.topics.split(",").filter((t) => t.trim()).length >
                    4 && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-300 rounded-md text-xs">
                      +
                      {formData.topics.split(",").filter((t) => t.trim())
                        .length - 4}{" "}
                      more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Subject Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Subject Category *
            </label>
            <input
              type="text"
              value={formData.subjectCategory}
              onChange={(e) => handleChange("subjectCategory", e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
                errors.subjectCategory
                  ? "border-red-300 dark:border-red-700"
                  : "border-gray-300 dark:border-gray-700"
              }`}
              placeholder="e.g., Web Development, Programming..."
            />
            {errors.subjectCategory && (
              <p className="text-red-500 text-sm mt-1">
                {errors.subjectCategory}
              </p>
            )}
          </div>

          {/* Duration and Video URL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                min="0"
                value={formData.duration}
                onChange={(e) => handleChange("duration", e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
                  errors.duration
                    ? "border-red-300 dark:border-red-700"
                    : "border-gray-300 dark:border-gray-700"
                }`}
                placeholder="30"
              />
              {errors.duration && (
                <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Video URL (optional)
              </label>
              <input
                type="url"
                value={formData.videoUrl}
                onChange={(e) => handleChange("videoUrl", e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
                  errors.videoUrl
                    ? "border-red-300 dark:border-red-700"
                    : "border-gray-300 dark:border-gray-700"
                }`}
                placeholder="https://youtube.com/watch?v=..."
              />
              {errors.videoUrl && (
                <p className="text-red-500 text-sm mt-1">{errors.videoUrl}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700 rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-purple-600 text-white rounded-xl font-medium transition-colors shadow-md"
            >
              {lesson ? "Update Lesson" : "Create Lesson"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LessonForm;
