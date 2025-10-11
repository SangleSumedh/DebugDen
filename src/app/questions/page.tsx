"use client";

import { useEffect, useState } from "react";
import { useQuestionStore } from "@/store/Question";
import { useVoteStore } from "@/store/Vote";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/Auth";
import { UserPrefs } from "@/store/Auth"; 
import ParticleBackground from "../components/ParticleBackground";
import QuestionCard from "../components/QuestionCard";

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
  const [mounted, setMounted] = useState(false);

  // Set mounted state to prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch all questions on mount
  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // Fetch votes whenever questions change
  useEffect(() => {
    questions.forEach((q) => fetchVotes("question", q.$id));
  }, [questions, fetchVotes]);

  const handleVote = (questionId: string, type: "upvoted" | "downvoted") => {
    if (!user) return;
    castVote("question", questionId, type);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/20 text-black dark:text-white transition-colors overflow-hidden">
      {/* Geometric Background */}
      <ParticleBackground />

      {/* Content */}
      <div className="relative z-10">
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
            <div className="space-y-6">
              {questions.map((q) => {
                const counts = voteCounts[`question-${q.$id}`] || {
                  upvotes: 0,
                  downvotes: 0,
                  score: 0,
                };

                const userVote = user
                  ? (votes[`question-${q.$id}-${user.$id}`] as
                      | "upvoted"
                      | "downvoted"
                      | null) ?? null
                  : null;

                return (
                  <QuestionCard
                    key={q.$id}
                    question={q}
                    voteCounts={counts}
                    userVote={userVote}
                    onVote={(type) => handleVote(q.$id, type)}
                    user={user}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
