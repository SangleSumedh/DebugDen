"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useQuestionStore } from "@/store/Question";
import { useVoteStore } from "@/store/Vote";
import { useAuthStore } from "@/store/Auth";
import ParticleBackground from "../components/ParticleBackground";
import QuestionCard from "../components/QuestionCard";
import { Filter } from "lucide-react";

// =====================
// Motion Variants
// =====================
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

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
  const [activeFilter, setActiveFilter] = useState("latest");

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);
  useEffect(() => {
    questions.forEach((q) => fetchVotes("question", q.$id));
  }, [questions, fetchVotes]);

  const handleVote = (questionId: string, type: "upvoted" | "downvoted") => {
    if (!user) {
      router.push("/login");
      return;
    }
    castVote("question", questionId, type);
  };

  // Prevent hydration mismatch
  if (!mounted)
    return <div className="min-h-screen bg-slate-50 dark:bg-[#0B0C10]" />;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="relative min-h-screen bg-slate-50 dark:bg-[#0B0C10] text-slate-900 dark:text-slate-100 selection:bg-blue-500/30 transition-colors duration-300"
    >
      <ParticleBackground />

      {/* ================= HERO SPACER ================= */}
      <div className="relative z-10 py-12 sm:pt-20 sm:pb-12 "></div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 p-4 rounded-xl shadow-sm dark:shadow-none transition-all mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">
              Top Questions
            </h2>
            <span className="bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs px-2 py-1 rounded-full border border-blue-200 dark:border-blue-500/20">
              {questions.length} results
            </span>
          </div>

          <div className="flex gap-2">
            {["latest"].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1.5 text-sm rounded-lg capitalize transition-all ${
                  activeFilter === filter
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {filter}
              </button>
            ))}
            <button
              onClick={() => router.push("/questions/new")}
              className="ml-2 px-4 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-black text-sm font-semibold rounded-lg hover:bg-slate-700 dark:hover:bg-slate-200 transition-colors shadow-md"
            >
              Ask Question
            </button>
          </div>
        </div>

        {/* Search Results Context */}
        <AnimatePresence>
          {searchQuery && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl flex justify-between items-center mb-6">
                <span className="text-amber-700 dark:text-amber-200">
                  Results for{" "}
                  <span className="font-bold">&quot;{searchQuery}&quot;</span>
                </span>
                <button
                  onClick={clearSearch}
                  className="text-sm text-amber-600 dark:text-amber-400 hover:underline"
                >
                  Clear Search
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Questions List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-48 rounded-xl bg-slate-200 dark:bg-white/5 animate-pulse border border-slate-300 dark:border-white/5"
              />
            ))}
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 border-dashed shadow-sm">
            <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
              No questions found
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 mb-6">
              Be the first to ask about this topic!
            </p>
            <button
              onClick={() => router.push("/questions/new")}
              className="px-6 py-2 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20"
            >
              Ask a Question
            </button>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
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
                  <motion.div key={q.$id} variants={itemVariants} layout>
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
    </motion.div>
  );
}
