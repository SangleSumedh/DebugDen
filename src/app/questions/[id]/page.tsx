"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { databases } from "@/models/client/config";
import { db, questionCollection } from "@/models/name";
import { useAuthStore } from "@/store/Auth";
import { useAnswerStore } from "@/store/Answer";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

interface Question {
  $id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
}

export default function QuestionDetail() {
  const { id } = useParams();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [newAnswer, setNewAnswer] = useState("");

  const { user } = useAuthStore();
  const {
    answers,
    fetchAnswers,
    addAnswer,
    loading: answersLoading,
  } = useAnswerStore();

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await databases.getDocument(
          db,
          questionCollection,
          id as string
        );
        setQuestion({
          $id: res.$id,
          title: res.title,
          content: res.content,
          authorId: res.authorId,
          createdAt: res.createdAt,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchQuestion();
      fetchAnswers(id as string);
    }
  }, [id, fetchAnswers]);

  const handleAddAnswer = async () => {
    if (!newAnswer.trim()) return;

    try {
      await addAnswer(id as string, newAnswer);
      setNewAnswer(""); // clear textarea after success
    } catch (err) {
      console.error("Failed to add answer:", err);
    }
  };

  if (loading) return <div className="p-6 text-white">Loading...</div>;

  if (!question)
    return <div className="p-6 text-red-500">Question not found</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto text-white">
      <Navbar />
      <div className="h-[15vh] w-full"></div>
      {/* Question */}
      <div className="bg-slate-800/50 p-6 rounded-2xl shadow-md mb-6">
        <h1 className="text-2xl font-bold mb-2">{question.title}</h1>
        <p className="mb-2">{question.content}</p>
        
      </div>

      {/* Answers */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Answers</h2>
        {answersLoading ? (
          <p>Loading answers...</p>
        ) : answers.length > 0 ? (
          answers.map((ans) => (
            <div
              key={ans.$id}
              className="bg-slate-700/40 p-4 rounded-xl border border-slate-600"
            >
              <p>{ans.content}</p>
              <span className="text-gray-300 text-sm">Answered by {ans.authorId}</span>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No answers yet. Be the first!</p>
        )}
      </div>

      {/* Add Answer */}
      {user ? (
        <div className="mt-6 bg-slate-800/50 p-4 rounded-xl">
          <h3 className="text-lg font-semibold mb-2">Your Answer</h3>
          <Textarea
            placeholder="Write your answer..."
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            className="mb-3 bg-slate-900 border-slate-700 text-white"
          />
          <Button onClick={handleAddAnswer}>Submit Answer</Button>
        </div>
      ) : (
        <p className="mt-6 text-gray-400">Login to submit an answer.</p>
      )}
    </div>
  );
}
