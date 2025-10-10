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
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, MessageCircle, ArrowLeft, User, Bot } from "lucide-react";
import Link from "next/link";

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
  const {
    answers,
    fetchAnswers,
    addAnswer,
    loading: answersLoading,
  } = useAnswerStore();
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
        alert("AI answer created successfully!");
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

  if (loading)
    return (
      <div className="min-h-screen bg-white dark:bg-black transition-colors">
        <Navbar />
        <div className="pt-32 flex items-center justify-center">
          <div className="text-slate-600 dark:text-slate-400">
            Loading question...
          </div>
        </div>
      </div>
    );

  if (!question)
    return (
      <div className="min-h-screen bg-white dark:bg-black transition-colors">
        <Navbar />
        <div className="pt-32 flex items-center justify-center">
          <div className="text-rose-600 dark:text-rose-400">
            Question not found
          </div>
        </div>
      </div>
    );

  // --- Votes for Question ---
  const qCounts = voteCounts[`question-${question.$id}`] || {
    upvotes: 0,
    downvotes: 0,
    score: 0,
  };
  const qUserVote = user ? votes[`question-${question.$id}-${user.$id}`] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/20 transition-colors">
      <Navbar />

      {/* Main Content */}
      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to questions
            </Link>
          </div>

          {/* Question Card */}
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/50 shadow-xl rounded-2xl mb-8">
            <CardContent className="px-8">
              <div className="flex items-start gap-6">
                {/* Voting Sidebar */}
                <div className="flex flex-col items-center space-y-3 flex-shrink-0">
                  <button
                    disabled={!user}
                    onClick={() =>
                      castVote("question", question.$id, "upvoted")
                    }
                    className={`p-3 rounded-xl transition-all ${
                      qUserVote === "upvoted"
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
                      className="w-6 h-6"
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
                    className={`text-lg font-bold px-3 py-1 rounded-full ${
                      qCounts.score > 0
                        ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20"
                        : qCounts.score < 0
                        ? "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20"
                        : "text-slate-500 dark:text-gray-400 bg-slate-100 dark:bg-slate-800"
                    }`}
                  >
                    {qCounts.score}
                  </span>

                  <button
                    disabled={!user}
                    onClick={() =>
                      castVote("question", question.$id, "downvoted")
                    }
                    className={`p-3 rounded-xl transition-all ${
                      qUserVote === "downvoted"
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
                      className="w-6 h-6"
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

                {/* Question Content */}
                <div className="flex-1 min-w-0">
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
                    {question.title}
                  </h1>

                  <div className="prose prose-slate dark:prose-invert max-w-none mb-6">
                    <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed whitespace-pre-wrap">
                      {question.content}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {question.authorName}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Asked on{" "}
                          {new Date(question.$createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setSelectedParentId(
                          selectedParentId === question.$id
                            ? null
                            : question.$id
                        )
                      }
                      className="flex items-center gap-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300"
                    >
                      <MessageCircle className="w-4 h-4" />
                      {selectedParentId === question.$id
                        ? "Cancel"
                        : "Add Comment"}
                    </Button>
                  </div>

                  {/* Question Comments */}
                  {questionComments.length > 0 && (
                    <div className="mt-6 space-y-3">
                      {questionComments.map((comment) => (
                        <div
                          key={comment.$id}
                          className="bg-slate-50/50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/60 dark:border-slate-700/50"
                        >
                          <p className="text-slate-700 dark:text-slate-300 text-sm mb-2">
                            {comment.content}
                          </p>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            - by {comment.authorName}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Comment Form for Question */}
              {selectedParentId === question.$id && user && (
                <div className="mt-6 bg-slate-50/50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200/60 dark:border-slate-700/50">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                    Add a Comment
                  </h3>
                  <Textarea
                    placeholder="Write your comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="mb-4 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-gray-400 focus:border-purple-500 dark:focus:border-purple-400"
                    rows={3}
                  />
                  <Button
                    onClick={() =>
                      handleAddComment(CommentParentType.Question, question.$id)
                    }
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    Submit Comment
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Answers Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Answers
                {answers.length > 0 && (
                  <span className="ml-2 text-slate-500 dark:text-slate-400 text-lg font-normal">
                    ({answers.length})
                  </span>
                )}
              </h2>
            </div>

            {answersLoading ? (
              <div className="text-center py-8">
                <div className="text-slate-500 dark:text-slate-400">
                  Loading answers...
                </div>
              </div>
            ) : answers.length > 0 ? (
              answers.map((ans) => {
                const answerComments = comments.filter(
                  (c) =>
                    c.type === CommentParentType.Answer && c.typeId === ans.$id
                );

                // --- Votes for Answer ---
                const aCounts = voteCounts[`answer-${ans.$id}`] || {
                  upvotes: 0,
                  downvotes: 0,
                  score: 0,
                };
                const aUserVote = user
                  ? votes[`answer-${ans.$id}-${user.$id}`]
                  : null;

                return (
                  <Card
                    key={ans.$id}
                    className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/50 shadow-lg rounded-2xl"
                  >
                    <CardContent className="px-6">
                      <div className="flex items-start gap-6">
                        {/* Voting Sidebar */}
                        <div className="flex flex-col items-center space-y-3 flex-shrink-0">
                          <button
                            disabled={!user}
                            onClick={() =>
                              castVote("answer", ans.$id, "upvoted")
                            }
                            className={`p-2 rounded-xl transition-all ${
                              aUserVote === "upvoted"
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
                              aCounts.score > 0
                                ? "text-emerald-600 dark:text-emerald-400"
                                : aCounts.score < 0
                                ? "text-rose-600 dark:text-rose-400"
                                : "text-slate-500 dark:text-gray-400"
                            }`}
                          >
                            {aCounts.score}
                          </span>

                          <button
                            disabled={!user}
                            onClick={() =>
                              castVote("answer", ans.$id, "downvoted")
                            }
                            className={`p-2 rounded-xl transition-all ${
                              aUserVote === "downvoted"
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

                        {/* Answer Content */}
                        <div className="flex-1 min-w-0">
                          <div className="prose prose-slate dark:prose-invert max-w-none mb-4">
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                              {ans.content}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                <User className="w-3 h-3 text-white" />
                              </div>
                              <span className="text-sm text-slate-600 dark:text-slate-400">
                                Answered by {ans.authorName}
                              </span>
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setSelectedParentId(
                                  selectedParentId === ans.$id ? null : ans.$id
                                )
                              }
                              className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                            >
                              <MessageCircle className="w-4 h-4 mr-1" />
                              {selectedParentId === ans.$id
                                ? "Cancel"
                                : "Comment"}
                            </Button>
                          </div>

                          {/* Answer Comments */}
                          {answerComments.length > 0 && (
                            <div className="mt-4 space-y-2">
                              {answerComments.map((comment) => (
                                <div
                                  key={comment.$id}
                                  className="bg-slate-50/50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200/60 dark:border-slate-700/50"
                                >
                                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">
                                    {comment.content}
                                  </p>
                                  <span className="text-xs text-slate-500 dark:text-slate-500">
                                    - by {comment.authorName}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Comment Form for Answer */}
                          {selectedParentId === ans.$id && user && (
                            <div className="mt-4 bg-slate-50/50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/60 dark:border-slate-700/50">
                              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                                Add a Comment
                              </h4>
                              <Textarea
                                placeholder="Write your comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="mb-3 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-gray-400"
                                rows={2}
                              />
                              <Button
                                size="sm"
                                onClick={() =>
                                  handleAddComment(
                                    CommentParentType.Answer,
                                    ans.$id
                                  )
                                }
                                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                              >
                                Submit Comment
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/50 rounded-2xl">
                <CardContent className="p-8 text-center">
                  <MessageCircle className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    No answers yet
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Be the first to share your knowledge!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Add Answer Section */}
          {user ? (
            <Card className="mt-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/50 shadow-xl rounded-2xl">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                  Your Answer
                </h3>
                <Textarea
                  placeholder="Write your detailed answer here... Be as specific as possible to help others understand your solution."
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  className="min-h-[200px] bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-gray-400 focus:border-purple-500 dark:focus:border-purple-400 mb-6 rounded-xl"
                />
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={handleAddAnswer}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-xl font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all"
                    size="lg"
                  >
                    Submit Answer
                  </Button>
                  <Button
                    onClick={handleGenerateAIAnswer}
                    disabled={aiLoading}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 rounded-xl font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all"
                    size="lg"
                  >
                    {aiLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Generating AI Answer...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Bot className="w-4 h-4" />
                        Answer with AI
                      </div>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="mt-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/50 rounded-2xl">
              <CardContent className="p-8 text-center">
                <p className="text-slate-600 dark:text-slate-400">
                  Please{" "}
                  <Link
                    href="/login"
                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    log in
                  </Link>{" "}
                  to submit an answer.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
