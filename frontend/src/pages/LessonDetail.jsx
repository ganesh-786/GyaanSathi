import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { GoogleGenAI } from "@google/genai";
import PromptInput from "../components/PromptInput";
import AIguide from "../components/AIguide";
import { useParams, useNavigate } from "react-router-dom";
import { getCourseById } from "../api/api";
import toast from "react-hot-toast";
import { ArrowLeft, Clock, ExternalLink, BookOpen, Tag } from "lucide-react";

const apiKey = import.meta.env.VITE_GEMINI_KEY;
const ai = new GoogleGenAI({ apiKey });

// Prompt template for quiz generation
const QUIZ_PROMPT_TEMPLATE = (userGoal) => `
You are a world-class instructor and mentor. Based on the provided user topic, evaluate the topic in depth and generate structured study resources. For each entry, provide:

Format (strict JSON only, no extra text or explanations):
{ 
  "id": number, 
  "topic": <related subtopic>, 
  "study_notes": <concise and practical study notes>, 
  "materials": [<list of best resources including at least one high-quality YouTube video link, articles, or documentation>], 
  "roadmap": <step-by-step roadmap for mastering this subtopic>, 
  "timeline": <realistic timeline to complete it> 
}

Rules:
- Generate at least 20 entries.
- Ensure every "materials" field contains a mix of resources with at least one YouTube video link that is best suited for the user's goal.
- Keep all content practical, structured, and beginner-to-advanced friendly.
- Output must be valid JSON only (no extra text, no explanations).

User's Topic: "${userGoal}"

`;

const LessonDetail = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { token, user } = useContext(AuthContext);
  const [course, setCourse] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  // Gemini AI state
  const [accessDenied, setAccessDenied] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState([]);
  const [prompt, setPrompt] = useState("");

  // Gemini AI handler
  const handleGemini = async () => {
    setAiLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: QUIZ_PROMPT_TEMPLATE(prompt),
      });

      let cleanedResponse = response.text
        .replace(/```json\n?/g, "") // Remove ```json
        .replace(/```\n?/g, "") // Remove ```
        .trim();

      let finalData = JSON.parse(cleanedResponse);
      setAiResponse(finalData.map((qtn) => qtn));
      setAiLoading(false);
    } catch (error) {
      setAiResponse([]);
      setAiLoading(false);
      toast.error("AI failed: " + (error.message || "Unknown error"));
    }
  };

  useEffect(() => {
    fetchCourseAndLesson();
  }, [courseId, lessonId, token]);

  const fetchCourseAndLesson = async () => {
    try {
      setLoading(true);
      setAccessDenied(false);
      const response = await getCourseById(courseId, token);

      if (response.success) {
        setCourse(response.data);

        const isAdminOrManager =
          user && (user.role === "admin" || user.role === "manager");
        const isCreator =
          user &&
          response.data.createdBy &&
          response.data.createdBy._id === user._id;

        // Check enrollment status
        let isEnrolled = false;
        if (typeof response.data.isEnrolled === "boolean") {
          isEnrolled = response.data.isEnrolled;
        } else if (Array.isArray(response.data.enrolledUsers) && user) {
          isEnrolled = response.data.enrolledUsers.some(
            (en) =>
              en.user && (en.user._id === user._id || en.user === user._id)
          );
        }

        // Access control: Admin/Manager have full access, creators have full access, users need enrollment
        const hasAccess = isAdminOrManager || isCreator || isEnrolled;

        if (!hasAccess) {
          setAccessDenied(true);
          setLesson(null);
          return;
        }

        // Find the specific lesson
        const foundLesson = response.data.lessons?.find(
          (l) => l.id === lessonId
        );
        if (foundLesson) {
          setLesson(foundLesson);
        } else {
          toast.error("Lesson not found");
          navigate(`/courses/${courseId}`);
        }
      } else {
        toast.error("Course not found");
        navigate("/");
      }
    } catch (error) {
      console.error("Failed to fetch lesson:", error);
      toast.error("Failed to load lesson details");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-500">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-yellow-400"></div>
      </div>
    );
  }

  // if (accessDenied) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-500">
  //       <div className="text-center">
  //         <h2 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-4">
  //           Access Denied
  //         </h2>
  //         <p className="mb-4 text-gray-700 dark:text-gray-300">
  //           You must be enrolled in this course to view its lessons.
  //         </p>
  //         <button
  //           onClick={() => navigate(`/courses/${courseId}`)}
  //           className="bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-purple-600 transition-colors duration-300"
  //         >
  //           Back to Course
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  if (!lesson || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-500">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Lesson Not Found
          </h2>
          <button
            onClick={() => navigate(`/courses/${courseId}`)}
            className="bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-purple-600 transition-colors duration-300"
          >
            Back to Course
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-500">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Navigation */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(`/courses/${courseId}`)}
            className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-purple-400 transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Course
          </button>

          <div className="text-sm text-gray-500">
            <span className="font-medium">{course.title}</span>
            <span className="mx-2">•</span>
            <span>{lesson.title}</span>
          </div>
        </div>

        {/* Lesson Content */}
        <div className="bg-white/80 dark:bg-gray-900/90 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden backdrop-blur-md transition-colors duration-500">
          {/* Lesson Header */}
          <div className="p-8 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight transition-colors duration-500">
                {lesson.title}
              </h1>
              {lesson.duration && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg transition-colors duration-500">
                  <Clock className="w-4 h-4" />
                  <span>{lesson.duration} minutes</span>
                </div>
              )}
            </div>

            {/* Lesson Meta */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300 transition-colors duration-500">
              {lesson.subjectCategory && (
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  <span>{lesson.subjectCategory}</span>
                </div>
              )}
            </div>

            {/* Topics */}
            {lesson.topics && lesson.topics.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 transition-colors duration-500">
                  Topics Covered:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {lesson.topics.map((topic, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium transition-colors duration-500"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Video Section */}
          {lesson.videoUrl && (
            <div className="p-8 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-500">
                Lesson Video
              </h3>
              <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden transition-colors duration-500">
                <iframe
                  src={lesson.videoUrl}
                  title={lesson.title}
                  className="w-full h-full"
                  allowFullScreen
                  onError={() => {
                    toast.error("Failed to load video");
                  }}
                />
              </div>
            </div>
          )}

          {/* Materials Section */}
          {lesson.materials && lesson.materials.length > 0 && (
            <div className="p-8 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2 transition-colors duration-500">
                <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Learning Materials
              </h3>
              <div className="space-y-3">
                {lesson.materials.map((material, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 transition-colors duration-500"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-500">
                      {index + 1}
                    </div>
                    <div className="flex-grow">
                      {material.startsWith("http") ? (
                        <a
                          href={material}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-purple-400 transition-colors font-medium flex items-center gap-2"
                        >
                          <span className="truncate">{material}</span>
                          <ExternalLink className="w-4 h-4 flex-shrink-0" />
                        </a>
                      ) : (
                        <span className="text-gray-700 dark:text-gray-200 font-medium transition-colors duration-500">
                          {material}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lesson Content */}
          <div className="p-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-500">
              Lesson Content
            </h3>
            {lesson.content ? (
              <div className="prose prose-lg max-w-none">
                <div className="text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-wrap transition-colors duration-500">
                  {lesson.content}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 transition-colors duration-500">
                  No additional content available for this lesson.
                </p>
              </div>
            )}
          </div>

          {/* Gemini AI Study Resource Generator */}
          <div className="p-8 border-t border-gray-100 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-indigo-700 dark:text-indigo-400 mb-4 transition-colors duration-500">
              AI-Powered Study Resources & Quiz Generator
            </h3>
            <PromptInput
              prompt={prompt}
              setPrompt={setPrompt}
              handleGemini={handleGemini}
              loading={aiLoading}
            />
            {aiLoading && (
              <div className="text-center text-indigo-600 dark:text-indigo-400 mt-4 animate-pulse">
                Generating resources...
              </div>
            )}
            {Array.isArray(aiResponse) && aiResponse.length > 0 && (
              <AIguide aiResponse={aiResponse} />
            )}
          </div>
        </div>

        {/* Navigation to Next/Previous Lessons */}
        {course.lessons && course.lessons.length > 1 && (
          <div className="mt-8 flex justify-between">
            {(() => {
              const currentIndex = course.lessons.findIndex(
                (l) => l.id === lessonId
              );
              const prevLesson =
                currentIndex > 0 ? course.lessons[currentIndex - 1] : null;
              const nextLesson =
                currentIndex < course.lessons.length - 1
                  ? course.lessons[currentIndex + 1]
                  : null;

              return (
                <>
                  <div>
                    {prevLesson && (
                      <button
                        onClick={() =>
                          navigate(
                            `/courses/${courseId}/lessons/${prevLesson.id}`
                          )
                        }
                        className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-purple-400 transition-colors font-medium"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Previous: {prevLesson.title}
                      </button>
                    )}
                  </div>

                  <div>
                    {nextLesson && (
                      <button
                        onClick={() =>
                          navigate(
                            `/courses/${courseId}/lessons/${nextLesson.id}`
                          )
                        }
                        className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-purple-400 transition-colors font-medium"
                      >
                        Next: {nextLesson.title}
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
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonDetail;
