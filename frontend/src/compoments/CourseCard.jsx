function CourseCard({ course, onViewCourse }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col group">
      {/* Course Image */}
      <div className="relative h-48 overflow-hidden bg-gray-50">
        <img
          src={
            course.imageUrl ||
            `https://placehold.co/400x250/3b82f6/FFFFFF?text=${encodeURIComponent(
              course.title
            )}`
          }
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://placehold.co/400x250/94a3b8/FFFFFF?text=Image+Error`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Lesson count badge */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm border border-white/20">
          <span className="text-sm font-medium text-gray-700">
            {Array.isArray(course.lessons) ? course.lessons.length : 0} lessons
          </span>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Course Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 leading-tight">
          {course.title}
        </h3>

        {/* Course Description */}
        <p className="text-gray-600 mb-4 flex-grow text-sm leading-relaxed line-clamp-3">
          {course.description}
        </p>

        {/* Lessons Preview */}
        {Array.isArray(course.lessons) && course.lessons.length > 0 ? (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <svg
                className="w-4 h-4 text-indigo-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              Course Content
            </h4>
            <div className="space-y-2">
              {course.lessons.slice(0, 2).map((lesson, index) => (
                <div
                  key={lesson.id || lesson._id || `lesson-${index}`}
                  className="flex items-center text-sm gap-3 p-2 rounded-lg bg-gray-50/50"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-medium">
                    {lesson.lessonNumber || index + 1}
                  </div>
                  <span className="truncate text-gray-700">
                    {lesson.title || lesson.name || `Lesson ${index + 1}`}
                  </span>
                </div>
              ))}
              {course.lessons.length > 2 && (
                <div className="text-xs text-gray-500 pl-9">
                  + {course.lessons.length - 2} more lessons
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-center gap-2 text-gray-500">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <span className="text-sm">No lessons available yet</span>
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={() => onViewCourse(course.id || course._id)}
          className="mt-auto w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-xl font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:ring-offset-1 shadow-sm hover:shadow-md flex items-center justify-center gap-2 group/btn"
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
      </div>
    </div>
  );
}

export default CourseCard;
