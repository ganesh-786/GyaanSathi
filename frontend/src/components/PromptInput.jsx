import React from "react";

const PromptInput = ({ prompt, setPrompt, handleGemini, loading }) => (
  <form
    className="w-full max-w-2xl mx-auto flex flex-col gap-4 bg-white/80 dark:bg-gray-900/80 rounded-xl shadow border border-indigo-100 dark:border-indigo-800 p-6"
    onSubmit={(e) => {
      e.preventDefault();
      if (!loading && prompt.trim()) handleGemini();
    }}
    aria-label="AI Prompt Input"
  >
    <label
      htmlFor="ai-prompt"
      className="block text-lg font-semibold text-indigo-700 dark:text-indigo-300 mb-1"
    >
      Ask the AI for custom study resources or a quiz
    </label>
    <textarea
      id="ai-prompt"
      rows={5}
      placeholder="E.g. 'Explain recursion with examples and provide a learning roadmap.'"
      value={prompt}
      onChange={(e) => setPrompt(e.target.value)}
      className="w-full rounded-lg border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-4 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-600 transition-all text-base resize-none shadow-sm placeholder-gray-400 dark:placeholder-gray-500"
      disabled={loading}
      required
    />
    <div className="flex justify-end">
      <button
        type="submit"
        className="inline-flex items-center gap-2 px-6 py-2 rounded-lg font-semibold bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow hover:from-indigo-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        disabled={loading || !prompt.trim()}
        aria-busy={loading}
      >
        {loading && (
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            ></path>
          </svg>
        )}
        {loading ? "Thinking..." : "Ask Gemini"}
      </button>
    </div>
  </form>
);

export default PromptInput;
