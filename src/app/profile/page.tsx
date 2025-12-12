"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useAuthStore } from "@/store/Auth";
import { useQuestionStore } from "@/store/Question";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Mail,
  Calendar,
  Trophy,
  MessageSquare,
  Activity,
  Layers,
} from "lucide-react";
import Link from "next/link";
import QuestionCard from "../components/QuestionCard";
import { useVoteStore } from "@/store/Vote";
import ParticleBackground from "../components/ParticleBackground";
import Image from "next/image";

export default function ProfilePage() {
  const { user, logout, fetchGoogleImage } = useAuthStore();
  const { filteredQuestions, fetchQuestions } = useQuestionStore();
  const { voteCounts, votes, fetchVotes } = useVoteStore(); // Added fetchVotes here
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    fetchQuestions();
  }, [fetchQuestions]);

  useEffect(() => {
    if (mounted && !user) {
      router.push("/login");
    }
  }, [mounted, user, router]);

  // Fetch votes for my questions to ensure stats are accurate
  const myQuestions = useMemo(() => {
    return filteredQuestions.filter((q) => q.authorId === user?.$id);
  }, [filteredQuestions, user]);

  useEffect(() => {
    if (myQuestions.length > 0) {
      myQuestions.forEach((q) => fetchVotes("question", q.$id));
    }
  }, [myQuestions, fetchVotes]);

  useEffect(() => {
    const loadRealAvatar = async () => {
      if (user?.prefs?.avatar) {
        setAvatarUrl(user.prefs.avatar);
        return;
      }
      const googleUrl = await fetchGoogleImage();
      if (googleUrl) {
        setAvatarUrl(googleUrl);
      }
    };
    if (user) loadRealAvatar();
  }, [user, fetchGoogleImage]);

  // --- DYNAMIC REPUTATION CALCULATION ---
  // Instead of static prefs, we sum the scores of all your questions
  const totalReputation = useMemo(() => {
    return myQuestions.reduce((acc, q) => {
      const score = voteCounts[`question-${q.$id}`]?.score || 0;
      return acc + score;
    }, 0);
  }, [myQuestions, voteCounts]);

  if (!mounted || !user)
    return <div className="min-h-screen bg-slate-50 dark:bg-[#0B0C10]" />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0C10] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <ParticleBackground />

      {/* ================= HEADER BACKGROUND ================= */}
      <div className="h-64 relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-[#0B0C10]" />

        {/* Animated Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 45, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/30 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, 50, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-purple-600/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            y: [0, -50, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute -bottom-32 -right-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px]"
        />

        {/* Tech Grid Overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
            maskImage:
              "linear-gradient(to bottom, black 40%, transparent 100%)",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-20 relative z-10 pb-20">
        {/* ================= PROFILE HEADER ================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#16181D] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center md:items-end gap-6 backdrop-blur-md"
        >
          {/* Avatar */}
          <div className="relative">
            <div className="w-32 h-32 rounded-2xl bg-gradient-to-tr from-blue-500 to-purple-500 p-1 shadow-lg group">
              <div className="w-full h-full rounded-xl bg-white dark:bg-[#0B0C10] flex items-center justify-center overflow-hidden relative">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 z-0">
                    {user.name.substring(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
            <div className="absolute -bottom-3 -right-3 bg-white dark:bg-[#16181D] p-1.5 rounded-full border border-slate-100 dark:border-white/10 shadow-sm">
              <div className="bg-emerald-500 w-4 h-4 rounded-full border-2 border-white dark:border-[#16181D]" />
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left space-y-2 mb-2">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              {user.name}
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Mail className="w-4 h-4" /> {user.email}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" /> Joined{" "}
                {new Date(user.$createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Logout Action */}
          <div className="flex gap-3">
            <button
              onClick={() => logout().then(() => router.push("/login"))}
              className="px-4 py-2 rounded-xl border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 font-medium transition-colors"
            >
              Log Out
            </button>
          </div>
        </motion.div>

        {/* ================= STATS GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <StatCard
            icon={<Trophy className="w-6 h-6 text-yellow-500" />}
            label="Total Reputation"
            value={totalReputation} // Using the calculated value here
            color="yellow"
          />
          <StatCard
            icon={<MessageSquare className="w-6 h-6 text-blue-500" />}
            label="Questions Asked"
            value={myQuestions.length}
            color="blue"
          />
          <StatCard
            icon={<Activity className="w-6 h-6 text-purple-500" />}
            label="Community Rank"
            value={
              totalReputation > 50
                ? "Expert"
                : totalReputation > 10
                ? "Contributor"
                : "Newbie"
            }
            color="purple"
          />
        </div>

        {/* ================= QUESTION LIST ================= */}
        <div className="mt-10">
          <div className="flex items-center gap-2 mb-6">
            <Layers className="w-5 h-5 text-slate-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              My Questions
            </h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {myQuestions.length > 0 ? (
              myQuestions.map((q) => {
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
                    onVote={() => {}} // User can't vote on their own profile list here
                    user={user}
                  />
                );
              })
            ) : (
              <div className="text-center py-12 bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 border-dashed">
                <p className="text-slate-500">
                  You haven&apos;t asked any questions yet.
                </p>
                <Link
                  href="/questions/new"
                  className="text-blue-500 hover:underline mt-2 inline-block"
                >
                  Ask your first question
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Helper Stats Component
function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}) {
  const colorStyles =
    {
      yellow:
        "bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border-yellow-200 dark:border-yellow-500/20",
      blue: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-500 border-blue-200 dark:border-blue-500/20",
      purple:
        "bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-500 border-purple-200 dark:border-purple-500/20",
    }[color] || "";

  return (
    <div className="bg-white dark:bg-[#16181D] p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center border ${colorStyles}`}
      >
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold text-slate-900 dark:text-white">
          {value}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-medium">
          {label}
        </div>
      </div>
    </div>
  );
}
