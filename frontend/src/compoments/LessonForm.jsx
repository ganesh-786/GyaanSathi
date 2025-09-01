import { useState } from "react";

const LessonForm = ({ lesson, onSave, onCancel }) => {
  const [lessonNumber, setLessonNumber] = useState(
    lesson ? lesson.lessonNumber || "" : ""
  );
  const [title, setTitle] = useState(lesson ? lesson.title : "");
  // Materials and topics are stored as comma-separated strings for form input
  const [materials, setMaterials] = useState(
    lesson ? lesson.materials.join(", ") : ""
  );
  const [topics, setTopics] = useState(lesson ? lesson.topics.join(", ") : "");
  const [subjectCategory, setSubjectCategory] = useState(
    lesson ? lesson.subjectCategory : ""
  );

  const handleSubmit = () => {
    if (!lessonNumber || !title || !materials || !topics || !subjectCategory) {
      console.error("Please fill in all lesson fields.");
      return;
    }
    onSave({
      id: lesson?.id || lesson?.lessonNumber || lessonNumber, // fallback for id
      lessonNumber,
      title,
      materials: materials
        .split(",")
        .map((m) => m.trim())
        .filter((m) => m),
      topics: topics
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t),
      subjectCategory,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-0 w-full max-w-lg mx-auto transform transition-all max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-gray-50 sticky top-0 bg-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-semibold text-gray-900 tracking-tight">
              {lesson ? "Edit Lesson" : "Create New Lesson"}
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
            {lesson
              ? "Update your lesson details"
              : "Fill in the information to create your lesson"}
          </p>
        </div>

        {/* Form Content */}
        <div className="px-8 py-6 space-y-6">
          {/* Lesson Number */}
          <div className="space-y-2">
            <label
              htmlFor="lessonNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Lesson Number
            </label>
            <input
              type="number"
              id="lessonNumber"
              value={lessonNumber}
              onChange={(e) => setLessonNumber(e.target.value)}
              className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-gray-400 text-sm"
              placeholder="1"
              required
              min="1"
            />
          </div>

          {/* Lesson Title */}
          <div className="space-y-2">
            <label
              htmlFor="lessonTitle"
              className="block text-sm font-medium text-gray-700"
            >
              Lesson Title
            </label>
            <input
              type="text"
              id="lessonTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-gray-400 text-sm"
              placeholder="Enter lesson title..."
              required
            />
          </div>

          {/* Learning Materials */}
          <div className="space-y-2">
            <label
              htmlFor="lessonMaterials"
              className="block text-sm font-medium text-gray-700"
            >
              Learning Materials
            </label>
            <div className="relative">
              <textarea
                id="lessonMaterials"
                value={materials}
                onChange={(e) => setMaterials(e.target.value)}
                rows="3"
                className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none placeholder:text-gray-400 text-sm"
                placeholder="Enter materials separated by commas..."
                required
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                <svg
                  className="w-4 h-4 inline mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Separate with commas
              </div>
            </div>
            {materials && (
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-2">
                  Preview ({materials.split(",").filter((m) => m.trim()).length}{" "}
                  items):
                </p>
                <div className="flex flex-wrap gap-1">
                  {materials
                    .split(",")
                    .filter((m) => m.trim())
                    .slice(0, 3)
                    .map((material, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs"
                      >
                        {material.trim().length > 20
                          ? material.trim().substring(0, 20) + "..."
                          : material.trim()}
                      </span>
                    ))}
                  {materials.split(",").filter((m) => m.trim()).length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-md text-xs">
                      +{materials.split(",").filter((m) => m.trim()).length - 3}{" "}
                      more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Topics Covered */}
          <div className="space-y-2">
            <label
              htmlFor="lessonTopics"
              className="block text-sm font-medium text-gray-700"
            >
              Topics Covered
            </label>
            <div className="relative">
              <textarea
                id="lessonTopics"
                value={topics}
                onChange={(e) => setTopics(e.target.value)}
                rows="3"
                className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none placeholder:text-gray-400 text-sm"
                placeholder="Enter topics separated by commas..."
                required
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                <svg
                  className="w-4 h-4 inline mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Separate with commas
              </div>
            </div>
            {topics && (
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-2">
                  Preview ({topics.split(",").filter((t) => t.trim()).length}{" "}
                  topics):
                </p>
                <div className="flex flex-wrap gap-1">
                  {topics
                    .split(",")
                    .filter((t) => t.trim())
                    .slice(0, 4)
                    .map((topic, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-green-50 text-green-700 rounded-md text-xs"
                      >
                        {topic.trim().length > 15
                          ? topic.trim().substring(0, 15) + "..."
                          : topic.trim()}
                      </span>
                    ))}
                  {topics.split(",").filter((t) => t.trim()).length > 4 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-md text-xs">
                      +{topics.split(",").filter((t) => t.trim()).length - 4}{" "}
                      more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Subject Category */}
          <div className="space-y-2">
            <label
              htmlFor="lessonSubjectCategory"
              className="block text-sm font-medium text-gray-700"
            >
              Subject Category
            </label>
            <input
              type="text"
              id="lessonSubjectCategory"
              value={subjectCategory}
              onChange={(e) => setSubjectCategory(e.target.value)}
              className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-gray-400 text-sm"
              placeholder="e.g., Web Development, Programming..."
              required
            />
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
              {lesson ? "Update Lesson" : "Create Lesson"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonForm;
