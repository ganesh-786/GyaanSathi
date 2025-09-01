import React from "react";

const AIguide = ({ aiResponse }) => (
  <div className="container mx-auto p-4 sm:p-8 space-y-10">
    {Array.isArray(aiResponse) &&
      aiResponse.map((qtn) => (
        <div
          key={qtn.id}
          className="bg-gradient-to-br from-white via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 rounded-2xl shadow-xl border border-indigo-100 dark:border-indigo-900 p-6 sm:p-10 transition-all duration-300 group hover:shadow-2xl"
        >
          {/* Topic */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold text-xl shadow">
              {qtn.id}
            </div>
            <h3 className="text-2xl font-extrabold text-indigo-800 dark:text-indigo-300 tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-200 transition-colors">
              {qtn.topic}
            </h3>
          </div>

          {/* Study Notes */}
          <div className="mb-6">
            <h4 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Study Notes
            </h4>
            <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed bg-indigo-50/60 dark:bg-gray-800/60 rounded-lg p-4 border border-indigo-100 dark:border-indigo-800">
              {qtn.study_notes}
            </p>
          </div>

          {/* Materials Table */}
          {Array.isArray(qtn.materials) && qtn.materials.length > 0 && (
            <div className="mb-6 overflow-x-auto">
              <h4 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Recommended Materials
              </h4>
              <table className="min-w-full text-sm border border-indigo-200 dark:border-indigo-800 rounded-lg overflow-hidden">
                <thead className="bg-indigo-100 dark:bg-indigo-900">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-indigo-700 dark:text-indigo-300">
                      #
                    </th>
                    <th className="px-4 py-2 text-left font-semibold text-indigo-700 dark:text-indigo-300">
                      Resource
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {qtn.materials.map((mat, idx) => (
                    <tr
                      key={idx}
                      className="border-t border-indigo-100 dark:border-indigo-800"
                    >
                      <td className="px-4 py-2 font-bold text-indigo-600 dark:text-indigo-400 align-top">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-2">
                        {typeof mat === "string" && mat.startsWith("http") ? (
                          <a
                            href={mat}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-blue-700 dark:text-blue-300 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium underline"
                          >
                            <span className="truncate max-w-xs inline-block align-middle">
                              {mat}
                            </span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14 3h7m0 0v7m0-7L10 14m-7 7h7a2 2 0 002-2v-7"
                              />
                            </svg>
                          </a>
                        ) : (
                          <span className="text-gray-700 dark:text-gray-200">
                            {mat}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Roadmap & Timeline */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 pt-6 border-t border-indigo-100 dark:border-indigo-800 mt-6">
            <div className="flex-1">
              <span className="block text-sm font-semibold text-indigo-700 dark:text-indigo-300 mb-1">
                Roadmap
              </span>
              <div className="bg-blue-50 dark:bg-gray-800 rounded-lg p-3 text-gray-700 dark:text-gray-200 border border-blue-100 dark:border-blue-900">
                {qtn.roadmap}
              </div>
            </div>
            <div className="flex-1 md:max-w-xs">
              <span className="block text-sm font-semibold text-indigo-700 dark:text-indigo-300 mb-1">
                Timeline
              </span>
              <div className="bg-indigo-50 dark:bg-indigo-900 rounded-lg p-3 text-indigo-700 dark:text-indigo-200 border border-indigo-100 dark:border-indigo-800 text-center font-bold">
                {qtn.timeline}
              </div>
            </div>
          </div>
        </div>
      ))}
  </div>
);

export default AIguide;
