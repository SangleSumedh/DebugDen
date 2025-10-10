"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useQuestionStore } from "@/store/Question";
import { useVoteStore } from "@/store/Vote";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/Auth";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
}

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | undefined>(undefined);
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

  // Initialize and animate particles - only on client side
  useEffect(() => {
    if (!mounted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Create particles
    const createParticles = () => {
      const particles: Particle[] = [];
      const particleCount = Math.min(
        100,
        Math.floor((window.innerWidth * window.innerHeight) / 15000)
      );

      const colors = ["#22d3ee", "#818cf8", "#a5b4fc", "#cbd5e1", "#e0f2fe"];

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.6 + 0.2,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
      return particles;
    };

    particlesRef.current = createParticles();

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return;

      // Clear with fade effect
      const isDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      ctx.fillStyle = isDarkMode
        ? "rgba(20, 20, 30, 0.05)"
        : "rgba(248, 250, 252, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesRef.current.forEach((particle, index) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x <= 0 || particle.x >= canvas.width)
          particle.speedX *= -1;
        if (particle.y <= 0 || particle.y >= canvas.height)
          particle.speedY *= -1;

        particle.opacity = 0.3 + Math.sin(Date.now() * 0.001 + index) * 0.3;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${hexToRgb(particle.color)}, ${
          particle.opacity
        })`;
        ctx.fill();

        if (Math.random() > 0.7) {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${hexToRgb(particle.color)}, ${
            particle.opacity * 0.3
          })`;
          ctx.fill();
        }
      });

      // Connections
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const dx = particlesRef.current[i].x - particlesRef.current[j].x;
          const dy = particlesRef.current[i].y - particlesRef.current[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(148, 163, 184, ${
              0.15 * (1 - distance / 100)
            })`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particlesRef.current[i].x, particlesRef.current[i].y);
            ctx.lineTo(particlesRef.current[j].x, particlesRef.current[j].y);
            ctx.stroke();
          }
        }
      }

      // Floating code-like symbols
      if (Math.random() < 0.02) {
        const symbols = [
          "{}",
          "[]",
          "();",
          "=>",
          "<>",
          "/*",
          "*/",
          "==",
          "!==",
          "++",
        ];
        const symbol = symbols[Math.floor(Math.random() * symbols.length)];
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;

        ctx.font = "12px monospace";
        ctx.fillStyle = `rgba(100, 116, 139, ${Math.random() * 0.3 + 0.1})`;
        ctx.fillText(symbol, x, y);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    // Helper to convert hex to rgb
    function hexToRgb(hex: string) {
      const bigint = parseInt(hex.replace("#", ""), 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return `${r}, ${g}, ${b}`;
    }

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mounted]); // Only run when mounted

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/20 text-black dark:text-white transition-colors overflow-hidden">
      {/* Animated Canvas Background - Only render on client */}
      {mounted && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 opacity-40 dark:opacity-20 transition-opacity duration-500"
        />
      )}

      {/* Static SVG Background (fallback) - Only render on client */}
      {mounted && (
        <div className="absolute inset-0 opacity-20 dark:opacity-10 pointer-events-none">
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
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Animated circles */}
            {Array.from({ length: 20 }).map((_, i) => (
              <circle
                key={`animated-${i}`}
                cx={`${Math.random() * 100}%`}
                cy={`${Math.random() * 100}%`}
                r={Math.random() * 4 + 1}
                fill="currentColor"
                className="text-blue-300 dark:text-blue-700"
                opacity={Math.random() * 0.3 + 0.1}
                filter="url(#glow)"
              >
                <animate
                  attributeName="r"
                  values={`${Math.random() * 2 + 1};${Math.random() * 4 + 2};${
                    Math.random() * 2 + 1
                  }`}
                  dur={`${Math.random() * 10 + 5}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values={`${Math.random() * 0.2 + 0.1};${
                    Math.random() * 0.4 + 0.2
                  };${Math.random() * 0.2 + 0.1}`}
                  dur={`${Math.random() * 8 + 4}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ))}
          </svg>
        </div>
      )}

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
