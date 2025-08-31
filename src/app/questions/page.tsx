"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useQuestionStore } from "@/store/Question";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/Auth";

export default function Home() {
  const router = useRouter();
  const { questions, fetchQuestions, loading } = useQuestionStore();
  const user = useAuthStore();

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

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
            No questions yet. Be the first to ask!
          </p>
        ) : (
          <div className="space-y-4">
            {questions.map((q) => (
              <Link className="p-4" key={q.$id} href={`/questions/${q.$id}`}>
                <div
                  key={q.$id}
                  className="p-4 bg-gray-900 rounded-xl shadow hover:shadow-lg transition"
                >
                  <h2 className="text-xl font-semibold">{q.title}</h2>
                  <p className="text-gray-400 mt-1">{q.content}</p>
                  <div className="flex justify-between items-center mt-3 text-sm text-gray-500">
                    <span>Asked by {q.authorId ?? "Anonymous"}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
