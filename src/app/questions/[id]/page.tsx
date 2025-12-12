"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { databases } from "@/models/client/config";
import { db, questionCollection } from "@/models/name";
import { useAuthStore } from "@/store/Auth";
import { useAnswerStore } from "@/store/Answer";
import { useCommentStore, CommentParentType } from "@/store/Comment";
import { useVoteStore } from "@/store/Vote";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import { ArrowLeft, Bot, MessageCircle, Send, Sparkles } from "lucide-react";
import Link from "next/link";
import ParticleBackground from "../../components/ParticleBackground";
import { motion } from "framer-motion";

interface Question {
  $id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  $createdAt: string;
}

export default function QuestionDetail() {
  const { id } = useParams();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [newAnswer, setNewAnswer] = useState("");
  const [newComment, setNewComment] = useState("");
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const [aiLoading, setAILoading] = useState(false);

  const { user } = useAuthStore();
  const { answers, fetchAnswers, addAnswer } = useAnswerStore();
  const { comments, fetchComments, addComment } = useCommentStore();
  const { voteCounts, votes, fetchVotes, castVote } = useVoteStore();

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await databases.getDocument(
          db,
          questionCollection,
          id as string
        );
        setQuestion(res as unknown as Question);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchQuestion();
      fetchAnswers(id as string);
      fetchComments(CommentParentType.Question, id as string);
      fetchVotes("question", id as string);
    }
  }, [id, fetchAnswers, fetchComments, fetchVotes]);

  useEffect(() => {
    answers.forEach((ans) => {
      fetchVotes("answer", ans.$id);
    });
  }, [answers, fetchVotes]);

  const handleAddAnswer = async () => {
    if (!newAnswer.trim()) return;
    try {
      await addAnswer(id as string, newAnswer);
      setNewAnswer("");
    } catch (err) {
      console.error("Failed to add answer:", err);
    }
  };

  const handleGenerateAIAnswer = async () => {
    if (!question) return;

    setAILoading(true);
    try {
      const res = await fetch("/api/ai-generated", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: question.$id,
          questionContent: question.content,
        }),
      });

      const data = await res.json();

      if (data.success) {
        fetchAnswers(question.$id);
      } else {
        console.error(data.error);
        alert("Failed to generate AI answer: " + data.error);
      }
    } catch (err) {
      console.error("Error calling AI API:", err);
      alert("Something went wrong while generating AI answer.");
    } finally {
      setAILoading(false);
    }
  };

  const handleAddComment = async (
    parentType: CommentParentType,
    parentId: string
  ) => {
    if (!newComment.trim() || !user) return;
    try {
      await addComment(newComment, parentType, parentId);
      setNewComment("");
      setSelectedParentId(null);
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  const questionComments = comments.filter(
    (c) => c.type === CommentParentType.Question && c.typeId === id
  );

  // --- HELPER: Avatar Component ---
  const UserAvatar = ({
    name,
    size = "md",
  }: {
    name: string;
    size?: "sm" | "md" | "lg";
  }) => {
    const sizeClasses = {
      sm: "w-6 h-6 text-xs",
      md: "w-10 h-10 text-sm",
      lg: "w-12 h-12 text-base",
    }[size];

    return (
      <div
        className={`relative ${sizeClasses} rounded-full overflow-hidden bg-gradient-to-tr from-blue-500 to-purple-500 p-[1px]`}
      >
        <div className="w-full h-full rounded-full bg-white dark:bg-[#0B0C10] flex items-center justify-center relative">
          <img
            src={`https://api.dicebear.com/9.x/initials/svg?seed=${name}&backgroundColor=transparent&chars=2`}
            alt={name}
            className="w-full h-full object-cover z-10"
          />
        </div>
      </div>
    );
  };

  if (loading)
    return <div className="min-h-screen bg-slate-50 dark:bg-[#0B0C10]" />;
  if (!question)
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0B0C10] flex items-center justify-center text-slate-500">
        Question not found
      </div>
    );

  const qCounts = voteCounts[`question-${question.$id}`] || {
    upvotes: 0,
    downvotes: 0,
    score: 0,
  };
  const qUserVote = user ? votes[`question-${question.$id}-${user.$id}`] : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0C10] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <ParticleBackground />
      <Navbar />

      <main className="relative z-10 pt-28 pb-20 px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-8 group"
        >
          <div className="p-2 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 group-hover:border-blue-500/50 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="font-medium">Back to feed</span>
        </Link>

        {/* ================= QUESTION CARD ================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 dark:bg-[#16181D]/70 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-6 sm:p-8 flex gap-6">
            {/* Voting Side */}
            <div className="flex flex-col items-center gap-2">
              <button
                disabled={!user}
                onClick={() => castVote("question", question.$id, "upvoted")}
                className={`p-2 rounded-xl transition-all ${
                  qUserVote === "upvoted"
                    ? "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10"
                    : "text-slate-400 hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-white/5"
                }`}
              >
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              <span
                className={`text-xl font-bold ${
                  qCounts.score > 0
                    ? "text-emerald-500"
                    : qCounts.score < 0
                    ? "text-rose-500"
                    : "text-slate-500"
                }`}
              >
                {qCounts.score}
              </span>

              <button
                disabled={!user}
                onClick={() => castVote("question", question.$id, "downvoted")}
                className={`p-2 rounded-xl transition-all ${
                  qUserVote === "downvoted"
                    ? "text-rose-500 bg-rose-50 dark:bg-rose-500/10"
                    : "text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-white/5"
                }`}
              >
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            {/* Content Side */}
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
                {question.title}
              </h1>

              <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
                <p className="whitespace-pre-wrap leading-relaxed">
                  {question.content}
                </p>
              </div>

              {/* Meta Footer */}
              <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-200 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <UserAvatar name={question.authorName} size="md" />
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {question.authorName}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Asked {new Date(question.$createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  onClick={() =>
                    setSelectedParentId(
                      selectedParentId === question.$id ? null : question.$id
                    )
                  }
                  className="text-slate-500 dark:text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {questionComments.length} Comments
                </Button>
              </div>

              {/* Comments Section */}
              {(questionComments.length > 0 ||
                selectedParentId === question.$id) && (
                <div className="mt-6 bg-slate-50 dark:bg-white/5 rounded-xl p-4 space-y-4">
                  {questionComments.map((c) => (
                    <div key={c.$id} className="flex gap-3 text-sm">
                      <UserAvatar name={c.authorName} size="sm" />
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-white mr-2">
                          {c.authorName}
                        </span>
                        <span className="text-slate-600 dark:text-slate-300">
                          {c.content}
                        </span>
                      </div>
                    </div>
                  ))}

                  {selectedParentId === question.$id && user && (
                    <div className="flex gap-3 pt-2">
                      <Textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="bg-white dark:bg-black/20 border-slate-200 dark:border-white/10 min-h-[60px]"
                      />
                      <Button
                        size="icon"
                        onClick={() =>
                          handleAddComment(
                            CommentParentType.Question,
                            question.$id
                          )
                        }
                        className="bg-blue-600 hover:bg-blue-500"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* ================= ANSWERS LIST ================= */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="bg-blue-600 w-1 h-6 rounded-full block" />
              {answers.length} Answers
            </h2>
          </div>

          <div className="space-y-6">
            {answers.map((ans) => {
              const answerComments = comments.filter(
                (c) =>
                  c.type === CommentParentType.Answer && c.typeId === ans.$id
              );
              const aCounts = voteCounts[`answer-${ans.$id}`] || { score: 0 };
              const aUserVote = user
                ? votes[`answer-${ans.$id}-${user.$id}`]
                : null;

              return (
                <div
                  key={ans.$id}
                  className="bg-white/70 dark:bg-[#16181D]/70 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 flex gap-6"
                >
                  {/* Answer Voting */}
                  <div className="flex flex-col items-center gap-1">
                    <button
                      onClick={() => castVote("answer", ans.$id, "upvoted")}
                      disabled={!user}
                      className={`p-1 rounded hover:bg-slate-100 dark:hover:bg-white/10 ${
                        aUserVote === "upvoted"
                          ? "text-emerald-500"
                          : "text-slate-400"
                      }`}
                    >
                      <svg
                        className="w-6 h-6"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" />
                      </svg>
                    </button>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {aCounts.score}
                    </span>
                    <button
                      onClick={() => castVote("answer", ans.$id, "downvoted")}
                      disabled={!user}
                      className={`p-1 rounded hover:bg-slate-100 dark:hover:bg-white/10 ${
                        aUserVote === "downvoted"
                          ? "text-rose-500"
                          : "text-slate-400"
                      }`}
                    >
                      <svg
                        className="w-6 h-6"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex-1">
                    <div className="prose prose-slate dark:prose-invert max-w-none mb-4 text-slate-700 dark:text-slate-300">
                      <p className="whitespace-pre-wrap">{ans.content}</p>
                    </div>

                    <div className="flex items-center justify-between text-sm pt-4 border-t border-slate-200 dark:border-white/5">
                      <div className="flex items-center gap-2">
                        <UserAvatar name={ans.authorName} size="sm" />
                        <span className="text-slate-900 dark:text-white font-medium">
                          {ans.authorName}
                        </span>
                        <span className="text-slate-500">• Answered</span>
                      </div>
                      <button
                        onClick={() =>
                          setSelectedParentId(
                            selectedParentId === ans.$id ? null : ans.$id
                          )
                        }
                        className="text-slate-500 hover:text-blue-500 transition-colors"
                      >
                        {answerComments.length > 0
                          ? `${answerComments.length} Comments`
                          : "Add Comment"}
                      </button>
                    </div>

                    {/* Answer Comments */}
                    {(answerComments.length > 0 ||
                      selectedParentId === ans.$id) && (
                      <div className="mt-4 pl-4 border-l-2 border-slate-200 dark:border-white/10 space-y-3">
                        {answerComments.map((c) => (
                          <div key={c.$id} className="text-sm">
                            <span className="font-semibold text-slate-800 dark:text-slate-200 mr-2">
                              {c.authorName}:
                            </span>
                            <span className="text-slate-600 dark:text-slate-400">
                              {c.content}
                            </span>
                          </div>
                        ))}
                        {selectedParentId === ans.$id && user && (
                          <div className="flex gap-2 pt-2">
                            {/* FIX: Typed Event Handler */}
                            <Input
                              value={newComment}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) => setNewComment(e.target.value)}
                              placeholder="Reply to answer..."
                              className="h-8 text-sm bg-transparent border-slate-300 dark:border-white/20"
                            />
                            <Button
                              size="sm"
                              onClick={() =>
                                handleAddComment(
                                  CommentParentType.Answer,
                                  ans.$id
                                )
                              }
                            >
                              Reply
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= INPUT AREA ================= */}
        {user ? (
          <div className="mt-12 bg-white/70 dark:bg-[#16181D]/70 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Your Answer
            </h3>
            <Textarea
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              placeholder="Provide a detailed answer to help the community..."
              className="min-h-[150px] bg-white dark:bg-black/20 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white resize-y rounded-xl focus:ring-2 focus:ring-blue-500/50 mb-4"
            />
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <button
                onClick={handleGenerateAIAnswer}
                disabled={aiLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 hover:border-purple-500/50 text-purple-600 dark:text-purple-400 transition-all"
              >
                {aiLoading ? (
                  <Sparkles className="w-4 h-4 animate-spin" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
                <span>Generate AI Draft</span>
              </button>
              <Button
                onClick={handleAddAnswer}
                size="lg"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500"
              >
                Post Answer
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-12 p-8 text-center bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 border-dashed">
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Log in to contribute an answer
            </p>
            <Link href="/login">
              <Button variant="outline">Log In</Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
