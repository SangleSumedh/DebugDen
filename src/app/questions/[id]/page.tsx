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

  const { user } = useAuthStore();
  const {
    answers,
    fetchAnswers,
    addAnswer,
    loading: answersLoading,
  } = useAnswerStore();
  const { comments, fetchComments, addComment } = useCommentStore();
  const { votes, fetchVotes, castVote } = useVoteStore();

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

      // fetch votes for question
      fetchVotes("question", id as string);
    }
  }, [id, fetchAnswers, fetchComments, fetchVotes]);

  // also fetch votes for answers when they load
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

  if (loading) return <div className="p-6 text-white">Loading...</div>;
  if (!question)
    return <div className="p-6 text-red-500">Question not found</div>;

  // calculate vote stats for question
  const qUpvotes = Object.values(votes).filter(
    (v) =>
      v.type === "question" &&
      v.typeId === question.$id &&
      v.voteStatus === "upvoted"
  ).length;
  const qDownvotes = Object.values(votes).filter(
    (v) =>
      v.type === "question" &&
      v.typeId === question.$id &&
      v.voteStatus === "downvoted"
  ).length;
  const qScore = qUpvotes - qDownvotes;
  const qUserVote = user ? votes[`question-${question.$id}-${user.$id}`] : null;

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

          {/* Voting */}
          <div className="flex items-center space-x-2">
            <button
              disabled={!user}
              onClick={() => castVote("question", question.$id, "upvoted")}
              className={`px-2 py-1 rounded ${
                qUserVote?.voteStatus === "upvoted"
                  ? "text-green-400"
                  : "text-gray-400 hover:text-green-300"
              }`}
            >
              ▲
            </button>
            <span className="text-sm text-white">{qScore}</span>
            <button
              disabled={!user}
              onClick={() => castVote("question", question.$id, "downvoted")}
              className={`px-2 py-1 rounded ${
                qUserVote?.voteStatus === "downvoted"
                  ? "text-red-400"
                  : "text-gray-400 hover:text-red-300"
              }`}
            >
              ▼
            </button>

            <Button
              variant="link"
              size="sm"
              onClick={() => setSelectedParentId(question.$id)}
              className="text-gray-400 hover:text-white"
            >
              Add a comment
            </Button>
          </div>
        </div>

        {/* Question Comments */}
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

            // vote stats for answer
            const aUpvotes = Object.values(votes).filter(
              (v) =>
                v.type === "answer" &&
                v.typeId === ans.$id &&
                v.voteStatus === "upvoted"
            ).length;
            const aDownvotes = Object.values(votes).filter(
              (v) =>
                v.type === "answer" &&
                v.typeId === ans.$id &&
                v.voteStatus === "downvoted"
            ).length;
            const aScore = aUpvotes - aDownvotes;
            const aUserVote = user
              ? votes[`answer-${ans.$id}-${user.$id}`]
              : null;

            return (
              <div
                key={ans.$id}
                className="bg-slate-700/40 p-4 rounded-xl border border-slate-600"
              >
                <p>{ans.content}</p>
                <div className="flex justify-between items-center text-sm text-gray-300">
                  <span>Answered by {ans.authorName}</span>
                  <div className="flex items-center space-x-2">
                    <button
                      disabled={!user}
                      onClick={() => castVote("answer", ans.$id, "upvoted")}
                      className={`px-2 py-1 rounded ${
                        aUserVote?.voteStatus === "upvoted"
                          ? "text-green-400"
                          : "text-gray-400 hover:text-green-300"
                      }`}
                    >
                      ▲
                    </button>
                    <span className="text-sm text-white">{aScore}</span>
                    <button
                      disabled={!user}
                      onClick={() => castVote("answer", ans.$id, "downvoted")}
                      className={`px-2 py-1 rounded ${
                        aUserVote?.voteStatus === "downvoted"
                          ? "text-red-400"
                          : "text-gray-400 hover:text-red-300"
                      }`}
                    >
                      ▼
                    </button>

                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => setSelectedParentId(ans.$id)}
                      className="text-gray-400 hover:text-white"
                    >
                      Add a comment
                    </Button>
                  </div>
                </div>

                {/* Answer Comments */}
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
