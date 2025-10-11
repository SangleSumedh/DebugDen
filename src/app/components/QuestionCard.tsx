"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { UserPrefs } from "@/store/Auth";
import { Models } from "node-appwrite";

interface Question {
  $id: string;
  title: string;
  content: string;
  authorName?: string;
}

interface QuestionCardProps {
  question: Question;
  voteCounts: {
    upvotes: number;
    downvotes: number;
    score: number;
  };
  userVote: "upvoted" | "downvoted" | null;
  onVote: (type: "upvoted" | "downvoted") => void;
  user: Models.User<UserPrefs> | null;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  voteCounts,
  userVote,
  onVote,
  user,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      ref={cardRef}
      className="relative p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/50 shadow-sm hover:shadow-2xl dark:shadow-slate-900/50 transition-all duration-500 rounded-2xl hover:border-transparent group overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated Border Gradient */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-purple-500/20 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Moving Shine Effect */}
      {mounted && (
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <div
            className={`absolute top-0 left-0 w-8 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transition-all duration-500 ${
              isHovered ? "translate-x-[calc(100vw+8rem)]" : "-translate-x-8"
            }`}
            style={{
              transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            {/* Question Title with Gradient Text on Hover */}
            <Link href={`/questions/${question.$id}`}>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 line-clamp-2">
                {question.title}
              </h2>
            </Link>

            {/* Question Content */}
            <p className="text-slate-600 dark:text-gray-300 mt-2 line-clamp-3 group-hover:text-slate-700 dark:group-hover:text-gray-200 transition-colors duration-300">
              {question.content}
            </p>

            {/* Metadata */}
            <div className="flex justify-between items-center mt-4 text-sm">
              <span className="text-slate-500 dark:text-gray-400 group-hover:text-slate-600 dark:group-hover:text-gray-300 transition-colors duration-300">
                Asked by {question.authorName ?? "Anonymous"}
              </span>
            </div>
          </div>

          {/* Voting UI */}
          <div className="flex flex-col items-center space-y-2 flex-shrink-0">
            <button
              disabled={!user}
              onClick={() => onVote("upvoted")}
              className={`p-2 rounded-xl transition-all duration-300 ${
                userVote === "upvoted"
                  ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 shadow-lg shadow-emerald-500/20"
                  : "text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:shadow-lg hover:shadow-emerald-500/10"
              } ${
                !user
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:scale-110 active:scale-95"
              } group/vote`}
              title={user ? "Upvote" : "Login to vote"}
            >
              <svg
                className={`w-5 h-5 transition-transform duration-300 ${
                  userVote === "upvoted"
                    ? "scale-110"
                    : "group-hover/vote:scale-110"
                }`}
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

            {/* Score with animated change */}
            <span
              className={`text-sm font-bold px-3 py-1 rounded-full transition-all duration-300 ${
                voteCounts.score > 0
                  ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20"
                  : voteCounts.score < 0
                  ? "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20"
                  : "text-slate-500 dark:text-gray-400 bg-slate-100 dark:bg-slate-800"
              } group-hover:scale-105 group-hover:shadow-sm`}
            >
              {voteCounts.score}
            </span>

            <button
              disabled={!user}
              onClick={() => onVote("downvoted")}
              className={`p-2 rounded-xl transition-all duration-300 ${
                userVote === "downvoted"
                  ? "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 shadow-lg shadow-rose-500/20"
                  : "text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:shadow-lg hover:shadow-rose-500/10"
              } ${
                !user
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:scale-110 active:scale-95"
              } group/vote`}
              title={user ? "Downvote" : "Login to vote"}
            >
              <svg
                className={`w-5 h-5 transition-transform duration-300 ${
                  userVote === "downvoted"
                    ? "scale-110"
                    : "group-hover/vote:scale-110"
                }`}
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

      {/* Background Pattern */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-full blur-xl" />
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-purple-500/5 rounded-full blur-xl" />
      </div>
    </div>
  );
};

export default QuestionCard;
