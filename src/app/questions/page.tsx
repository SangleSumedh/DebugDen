"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useQuestionStore } from "@/store/Question";
import { useVoteStore } from "@/store/Vote";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/Auth";

export default function Home() {
  const router = useRouter();
  const {
    filteredQuestions: questions,
    fetchQuestions,
    loading,
    searchQuery,
    clearSearch,
  } = useQuestionStore();
  const { voteCounts, votes, fetchVotes, castVote } = useVoteStore();
  const { user } = useAuthStore();

  // Fetch all questions on mount
  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // Fetch votes whenever questions change
  useEffect(() => {
    questions.forEach((q) => fetchVotes("question", q.$id));
  }, [questions, fetchVotes]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/20 text-black dark:text-white transition-colors overflow-hidden">
      {/* Particle Dust Background */}
      <div className="absolute inset-0 opacity-30 dark:opacity-20">
        <svg
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0"
        >
          <defs>
            <radialGradient id="dustGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.1" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Large background particles */}
          {Array.from({ length: 50 }).map((_, i) => (
            <circle
              key={`large-${i}`}
              cx={`${Math.random() * 100}%`}
              cy={`${Math.random() * 100}%`}
              r={Math.random() * 2 + 0.5}
              fill="currentColor"
              className="text-slate-300 dark:text-slate-600"
              opacity={Math.random() * 0.3 + 0.1}
            >
              <animate
                attributeName="opacity"
                values={`${Math.random() * 0.3 + 0.1};${
                  Math.random() * 0.5 + 0.2
                };${Math.random() * 0.3 + 0.1}`}
                dur={`${Math.random() * 10 + 5}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}

          {/* Medium particles */}
          {Array.from({ length: 80 }).map((_, i) => (
            <circle
              key={`medium-${i}`}
              cx={`${Math.random() * 100}%`}
              cy={`${Math.random() * 100}%`}
              r={Math.random() * 1 + 0.3}
              fill="currentColor"
              className="text-slate-400 dark:text-slate-500"
              opacity={Math.random() * 0.2 + 0.1}
            >
              <animate
                attributeName="opacity"
                values={`${Math.random() * 0.2 + 0.1};${
                  Math.random() * 0.3 + 0.15
                };${Math.random() * 0.2 + 0.1}`}
                dur={`${Math.random() * 8 + 4}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}

          {/* Small particles */}
          {Array.from({ length: 120 }).map((_, i) => (
            <circle
              key={`small-${i}`}
              cx={`${Math.random() * 100}%`}
              cy={`${Math.random() * 100}%`}
              r={Math.random() * 0.5 + 0.1}
              fill="currentColor"
              className="text-slate-500 dark:text-slate-400"
              opacity={Math.random() * 0.15 + 0.05}
            >
              <animate
                attributeName="opacity"
                values={`${Math.random() * 0.15 + 0.05};${
                  Math.random() * 0.25 + 0.1
                };${Math.random() * 0.15 + 0.05}`}
                dur={`${Math.random() * 6 + 3}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}

          {/* Floating particles with movement */}
          {Array.from({ length: 30 }).map((_, i) => (
            <circle
              key={`float-${i}`}
              cx={`${Math.random() * 100}%`}
              cy={`${Math.random() * 100}%`}
              r={Math.random() * 1.5 + 0.5}
              fill="url(#dustGradient)"
              className="text-blue-200 dark:text-blue-900"
            >
              <animate
                attributeName="cx"
                values={`${Math.random() * 100}%;${Math.random() * 100}%`}
                dur={`${Math.random() * 20 + 10}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="cy"
                values={`${Math.random() * 100}%;${Math.random() * 100}%`}
                dur={`${Math.random() * 15 + 8}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <div className="h-[15vh] w-full"></div>

        {/* Action bar */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            All Questions
          </h1>
          <button
            onClick={() => router.push("/questions/new")}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 active:scale-95"
          >
            Ask Question
          </button>
        </div>

        {/* Search Results Indicator */}
        {searchQuery && (
          <div className="relative z-10 max-w-5xl mx-auto px-4 mb-4">
            <div className="p-4 bg-blue-50/80 dark:bg-blue-900/30 backdrop-blur-sm border border-blue-200/60 dark:border-blue-800/60 rounded-xl">
              <p className="text-blue-800 dark:text-blue-200">
                Search results for:{" "}
                <span className="font-semibold">
                  &ldquo;{searchQuery}&rdquo;
                </span>
                <button
                  onClick={clearSearch}
                  className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline font-medium"
                >
                  Clear search
                </button>
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                Found {questions.length} question
                {questions.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        )}

        {/* Questions list */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 py-6">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="p-6 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-200/60 dark:border-slate-700/50 shadow-sm animate-pulse"
                >
                  <div className="h-6 bg-slate-300 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-full mb-2"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-5/6"></div>
                </div>
              ))}
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-slate-400 dark:text-slate-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M11 14H9a2 2 0 01-2-2V9a2 2 0 012-2h5a2 2 0 012 2v1"
                  />
                </svg>
              </div>
              <p className="text-slate-600 dark:text-gray-400 text-lg mb-4">
                {searchQuery
                  ? "No questions found matching your search."
                  : "No questions yet."}
              </p>
              {searchQuery ? (
                <button
                  onClick={clearSearch}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline font-medium transition-colors"
                >
                  Clear search
                </button>
              ) : (
                <button
                  onClick={() => router.push("/questions/new")}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
                >
                  Be the first to ask!
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((q) => {
                // Get vote counts (optimistically updated)
                const counts = voteCounts[`question-${q.$id}`] || {
                  upvotes: 0,
                  downvotes: 0,
                  score: 0,
                };

                // Get current user's vote
                const userVote = user
                  ? votes[`question-${q.$id}-${user.$id}`] ?? null
                  : null;

                return (
                  <div
                    key={q.$id}
                    className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/50 shadow-sm hover:shadow-xl dark:shadow-slate-900/50 transition-all duration-300 rounded-2xl hover:border-slate-300/60 dark:hover:border-slate-600/50"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <Link href={`/questions/${q.$id}`}>
                          <h2 className="text-xl font-semibold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2">
                            {q.title}
                          </h2>
                        </Link>
                        <p className="text-slate-600 dark:text-gray-300 mt-2 line-clamp-3">
                          {q.content}
                        </p>
                        <div className="flex justify-between items-center mt-4 text-sm">
                          <span className="text-slate-500 dark:text-gray-400">
                            Asked by {q.authorName ?? "Anonymous"}
                          </span>
                        </div>
                      </div>

                      {/* Voting UI */}
                      <div className="flex flex-col items-center space-y-1 flex-shrink-0">
                        <button
                          disabled={!user}
                          onClick={() => castVote("question", q.$id, "upvoted")}
                          className={`p-2 rounded-lg transition-all ${
                            userVote === "upvoted"
                              ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20"
                              : "text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                          } ${
                            !user
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:scale-110"
                          }`}
                          title={user ? "Upvote" : "Login to vote"}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>

                        <span
                          className={`text-sm font-semibold px-2 py-1 rounded ${
                            counts.score > 0
                              ? "text-emerald-600 dark:text-emerald-400"
                              : counts.score < 0
                              ? "text-rose-600 dark:text-rose-400"
                              : "text-slate-500 dark:text-gray-400"
                          }`}
                        >
                          {counts.score}
                        </span>

                        <button
                          disabled={!user}
                          onClick={() =>
                            castVote("question", q.$id, "downvoted")
                          }
                          className={`p-2 rounded-lg transition-all ${
                            userVote === "downvoted"
                              ? "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20"
                              : "text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                          } ${
                            !user
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:scale-110"
                          }`}
                          title={user ? "Downvote" : "Login to vote"}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
