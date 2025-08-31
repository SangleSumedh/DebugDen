"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { databases } from "@/models/client/config";
import { db, questionCollection } from "@/models/name";
import { useAuthStore } from "@/store/Auth";
import { useAnswerStore } from "@/store/Answer";
import { useCommentStore, CommentParentType } from "@/store/Comment"; // Import the comment store
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

interface Question {
  $id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string; // Add authorName to question interface
  $createdAt: string;
}

export default function QuestionDetail() {
  const { id } = useParams();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [newAnswer, setNewAnswer] = useState("");
  const [newComment, setNewComment] = useState(""); // State for a new comment
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);

  const { user } = useAuthStore();
  const {
    answers,
    fetchAnswers,
    addAnswer,
    loading: answersLoading,
  } = useAnswerStore();

  const {
    comments,
    fetchComments,
    addComment,
    loading: commentsLoading,
  } = useCommentStore(); // Use the comment store

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await databases.getDocument(
          db,
          questionCollection,
          id as string
        );
        setQuestion(res as unknown as Question); // Cast the response directly
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchQuestion();
      fetchAnswers(id as string);
      // Fetch comments for the main question initially
      fetchComments(CommentParentType.Question, id as string);
    }
  }, [id, fetchAnswers, fetchComments]);

  const handleAddAnswer = async () => {
    if (!newAnswer.trim()) return;

    try {
      await addAnswer(id as string, newAnswer);
      setNewAnswer(""); // clear textarea after success
    } catch (err) {
      console.error("Failed to add answer:", err);
    }
  };

  const handleAddComment = async (
    parentType: CommentParentType,
    parentId: string
  ) => {
    if (!newComment.trim() || !user) return;

    try {
      await addComment(newComment, parentType, parentId);
      setNewComment(""); // clear comment textarea after success
      setSelectedParentId(null); // Hide the comment form
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  const questionComments = comments.filter(
    (c) => c.type === CommentParentType.Question && c.typeId === id
  );

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
        <div className="flex justify-between items-center text-sm text-gray-400">
          <span>Asked by {question.authorName}</span>
          <Button
            variant="link"
            size="sm"
            onClick={() => setSelectedParentId(question.$id)}
            className="text-gray-400 hover:text-white"
          >
            Add a comment
          </Button>
        </div>

        {/* Question Comments Section */}
        {questionComments.length > 0 && (
          <div className="mt-4 space-y-2">
            {questionComments.map((comment) => (
              <div
                key={comment.$id}
                className="bg-slate-700/40 p-3 rounded-lg border border-slate-600"
              >
                <p className="text-sm">{comment.content}</p>
                <span className="text-gray-300 text-xs">
                  - by {comment.authorName}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Comment Form for Question */}
      {selectedParentId === question.$id && user && (
        <div className="mt-4 bg-slate-800/50 p-4 rounded-xl">
          <h3 className="text-lg font-semibold mb-2">Your Comment</h3>
          <Textarea
            placeholder="Write your comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="mb-3 bg-slate-900 border-slate-700 text-white"
          />
          <Button
            onClick={() =>
              handleAddComment(CommentParentType.Question, question.$id)
            }
          >
            Submit Comment
          </Button>
        </div>
      )}

      {/* Answers */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Answers</h2>
        {answersLoading ? (
          <p>Loading answers...</p>
        ) : answers.length > 0 ? (
          answers.map((ans) => {
            const answerComments = comments.filter(
              (c) => c.type === CommentParentType.Answer && c.typeId === ans.$id
            );
            return (
              <div
                key={ans.$id}
                className="bg-slate-700/40 p-4 rounded-xl border border-slate-600"
              >
                <p>{ans.content}</p>
                <div className="flex justify-between items-center text-sm text-gray-300">
                  <span>Answered by {ans.authorName}</span>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => setSelectedParentId(ans.$id)}
                    className="text-gray-400 hover:text-white"
                  >
                    Add a comment
                  </Button>
                </div>

                {/* Answer Comments Section */}
                {answerComments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {answerComments.map((comment) => (
                      <div
                        key={comment.$id}
                        className="bg-slate-600/40 p-3 rounded-lg border border-slate-500"
                      >
                        <p className="text-sm">{comment.content}</p>
                        <span className="text-gray-300 text-xs">
                          - by {comment.authorName}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Comment Form for Answer */}
                {selectedParentId === ans.$id && user && (
                  <div className="mt-4 bg-slate-800/50 p-4 rounded-xl">
                    <h3 className="text-lg font-semibold mb-2">Your Comment</h3>
                    <Textarea
                      placeholder="Write your comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="mb-3 bg-slate-900 border-slate-700 text-white"
                    />
                    <Button
                      onClick={() =>
                        handleAddComment(CommentParentType.Answer, ans.$id)
                      }
                    >
                      Submit Comment
                    </Button>
                  </div>
                )}
              </div>
            );
          })
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