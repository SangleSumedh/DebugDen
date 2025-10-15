"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useQuestionStore } from "@/store/Question";
import { useVoteStore } from "@/store/Vote";
import { useAuthStore } from "@/store/Auth";
import ParticleBackground from "../components/ParticleBackground";
import QuestionCard from "../components/QuestionCard";

// =====================
// Motion Variants
// =====================

// Container for staggered children
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

// Individual question card animation
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// Button hover/tap animation
const buttonVariants: Variants = {
  initial: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95, transition: { duration: 0.1 } },
};

// Search results animation
const searchResultsVariants: Variants = {
  hidden: { opacity: 0, height: 0, marginBottom: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    marginBottom: "1rem",
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

// Empty state animation
const emptyStateVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// Loading animation container
const loadingVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

// Individual loading item
const loadingItemVariants: Variants = {
  hidden: { opacity: 0.5 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, repeat: Infinity, repeatType: "reverse" },
  },
};

// Page transition animation
const pageTransitionVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.4 } },
};

// =====================
// Home Page Component
// =====================

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

  // Mount check to avoid hydration issues
  useEffect(() => setMounted(true), []);

  // Fetch questions on mount
  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // Fetch votes for each question
  useEffect(() => {
    questions.forEach((q) => fetchVotes("question", q.$id));
  }, [questions, fetchVotes]);

  const handleVote = (questionId: string, type: "upvoted" | "downvoted") => {
    if (!user) return;
    castVote("question", questionId, type);
  };

  if (!mounted)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/20" />
    );

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={pageTransitionVariants}
      className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/20 text-black dark:text-white transition-colors overflow-hidden"
    >
      <ParticleBackground />
      <div className="relative z-10">
        <div className="h-[15vh] w-full" />

        {/* Action Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 max-w-5xl mx-auto px-4 py-4 flex justify-between items-center"
        >
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl font-bold text-slate-900 dark:text-white"
          >
            All Questions
          </motion.h1>
          <motion.button
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            onClick={() => router.push("/questions/new")}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
          >
            Ask Question
          </motion.button>
        </motion.div>

        {/* Search Results */}
        <AnimatePresence>
          {searchQuery && (
            <motion.div
              variants={searchResultsVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="relative z-10 max-w-5xl mx-auto px-4"
            >
              <div className="p-4 bg-blue-50/80 dark:bg-blue-900/30 backdrop-blur-sm border border-blue-200/60 dark:border-blue-800/60 rounded-xl">
                <p className="text-blue-800 dark:text-blue-200">
                  Search results for:{" "}
                  <span className="font-semibold">
                    &ldquo;{searchQuery}&rdquo;
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearSearch}
                    className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline font-medium"
                  >
                    Clear search
                  </motion.button>
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                  Found {questions.length} question
                  {questions.length !== 1 ? "s" : ""}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Questions List */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 py-6">
          {loading ? (
            <motion.div
              variants={loadingVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  variants={loadingItemVariants}
                  className="p-6 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-200/60 dark:border-slate-700/50 shadow-sm"
                >
                  <div className="h-6 bg-slate-300 dark:bg-slate-700 rounded w-3/4 mb-4" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-full mb-2" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-5/6" />
                </motion.div>
              ))}
            </motion.div>
          ) : questions.length === 0 ? (
            <motion.div
              variants={emptyStateVariants}
              initial="hidden"
              animate="visible"
              className="text-center py-12"
            >
              {/* Empty state icon and text */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5, type: "spring", bounce: 0.5 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full mb-4"
              >
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
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-slate-600 dark:text-gray-400 text-lg mb-4"
              >
                {searchQuery
                  ? "No questions found matching your search."
                  : "No questions yet."}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {searchQuery ? (
                  <motion.button
                    variants={buttonVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={clearSearch}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline font-medium transition-colors"
                  >
                    Clear search
                  </motion.button>
                ) : (
                  <motion.button
                    variants={buttonVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => router.push("/questions/new")}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
                  >
                    Be the first to ask!
                  </motion.button>
                )}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <AnimatePresence mode="popLayout">
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
                    <motion.div
                      key={q.$id}
                      variants={itemVariants}
                      layout
                      initial="hidden"
                      animate="visible"
                      exit={{
                        opacity: 0,
                        x: -100,
                        transition: { duration: 0.3 },
                      }}
                      whileHover={{
                        scale: 1.01,
                        transition: { duration: 0.2 },
                      }}
                    >
                      <QuestionCard
                        question={q}
                        voteCounts={counts}
                        userVote={userVote}
                        onVote={(type) => handleVote(q.$id, type)}
                        user={user}
                      />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
