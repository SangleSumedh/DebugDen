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
  const { questions, fetchQuestions, loading } = useQuestionStore();
  const { votes, fetchVotes, castVote } = useVoteStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // fetch votes whenever questions change
  useEffect(() => {
    if (questions.length > 0) {
      questions.forEach((q) => fetchVotes("question", q.$id));
    }
  }, [questions, fetchVotes]);

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Navbar */}
      <Navbar />

      <div className="h-[15vh] w-full"></div>

      {/* Action bar under navbar */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">All Questions</h1>
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/questions/new")}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition shadow-md"
          >
            Ask Question
          </button>
        </div>
      </div>

      {/* Questions list */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-6">
        {loading ? (
          <p className="text-gray-400">Loading questions...</p>
        ) : questions.length === 0 ? (
          <p className="text-gray-400">
            No questions yet.{" "}
            <button
              onClick={() => router.push("/questions/new")}
              className="text-blue-400 hover:underline"
            >
              Be the first to ask!
            </button>
          </p>
        ) : (
          <div className="space-y-4">
            {questions.map((q) => {
              const upvotes = Object.values(votes).filter(
                (v) =>
                  v.type === "question" &&
                  v.typeId === q.$id &&
                  v.voteStatus === "upvoted"
              ).length;
              const downvotes = Object.values(votes).filter(
                (v) =>
                  v.type === "question" &&
                  v.typeId === q.$id &&
                  v.voteStatus === "downvoted"
              ).length;
              const score = upvotes - downvotes;

              // Check if current user voted
              const userVote = user
                ? votes[`question-${q.$id}-${user.$id}`]
                : null;

              return (
                <div
                  key={q.$id}
                  className="p-4 bg-gray-900 rounded-xl shadow hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <Link href={`/questions/${q.$id}`}>
                        <h2 className="text-xl font-semibold hover:underline">
                          {q.title}
                        </h2>
                      </Link>
                      <p className="text-gray-400 mt-1">{q.content}</p>
                      <div className="flex justify-between items-center mt-3 text-sm text-gray-500">
                        <span>Asked by {q.authorName ?? "Anonymous"}</span>
                      </div>
                    </div>

                    {/* Voting UI */}
                    <div className="flex flex-col items-center ml-4">
                      <button
                        disabled={!user}
                        onClick={() => castVote("question", q.$id, "upvoted")}
                        className={`px-2 py-1 rounded ${
                          userVote?.voteStatus === "upvoted"
                            ? "text-green-400"
                            : "text-gray-400 hover:text-green-300"
                        }`}
                      >
                        ▲
                      </button>
                      <span className="text-sm text-white">{score}</span>
                      <button
                        disabled={!user}
                        onClick={() => castVote("question", q.$id, "downvoted")}
                        className={`px-2 py-1 rounded ${
                          userVote?.voteStatus === "downvoted"
                            ? "text-red-400"
                            : "text-gray-400 hover:text-red-300"
                        }`}
                      >
                        ▼
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
  );
}
