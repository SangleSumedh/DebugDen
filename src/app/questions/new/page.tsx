"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuestionStore } from "@/store/Question";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function NewQuestionPage() {
  const { addQuestion, error, loading } = useQuestionStore();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    const tagList = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    await addQuestion(title, content, tagList);

    if (!error) {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950/20 transition-colors">
      <Navbar />

      {/* Main content with proper spacing */}
      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Back button */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to questions
            </Button>
          </div>

          {/* Loading Overlay */}
          {loading && (
            <div className="fixed inset-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
              <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl">
                <CardContent className="p-8 text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600 mx-auto mb-4"></div>
                  <p className="font-semibold text-slate-900 dark:text-white text-lg">
                    Posting your question...
                  </p>
                  <p className="text-slate-500 dark:text-gray-400 text-sm mt-2">
                    Sharing with the DebugDen community
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 mb-4">
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                Ask the Community
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              <span className="bg-gradient-to-r from-slate-900 via-purple-600 to-blue-600 dark:from-slate-100 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                Ask a Question
              </span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-md mx-auto">
              Get help from developers around the world
            </p>
          </div>

          {/* Form Card */}
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/50 shadow-xl rounded-2xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title Field */}
                <div className="space-y-3">
                  <Label
                    htmlFor="title"
                    className="text-sm font-semibold text-slate-900 dark:text-white"
                  >
                    Question Title *
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    value={title}
                    disabled={loading}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What's your programming question?"
                    required
                    className="h-12 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-gray-400 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 transition-all rounded-xl"
                  />
                  <p className="text-xs text-slate-500 dark:text-gray-400">
                    Be specific and descriptive about your problem
                  </p>
                </div>

                {/* Content Field */}
                <div className="space-y-3">
                  <Label
                    htmlFor="content"
                    className="text-sm font-semibold text-slate-900 dark:text-white"
                  >
                    Detailed Explanation *
                  </Label>
                  <Textarea
                    id="content"
                    value={content}
                    disabled={loading}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Describe your problem in detail. Include code snippets, error messages, and what you've already tried..."
                    required
                    className="min-h-[200px] bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-gray-400 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 resize-y transition-all rounded-xl"
                  />
                  <p className="text-xs text-slate-500 dark:text-gray-400">
                    Include as much detail as possible for better answers
                  </p>
                </div>

                {/* Tags Field */}
                <div className="space-y-3">
                  <Label
                    htmlFor="tags"
                    className="text-sm font-semibold text-slate-900 dark:text-white"
                  >
                    Tags
                  </Label>
                  <Input
                    id="tags"
                    type="text"
                    value={tags}
                    disabled={loading}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="javascript, react, nextjs, typescript, debugging"
                    className="h-12 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-gray-400 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 transition-all rounded-xl"
                  />
                  <p className="text-xs text-slate-500 dark:text-gray-400">
                    Add relevant tags to help others find your question (comma
                    separated)
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={loading}
                    className="flex-1 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl py-3 font-semibold transition-all"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl py-3 font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Posting...
                      </div>
                    ) : (
                      "Post Your Question"
                    )}
                  </Button>
                </div>
              </form>

              {/* Error Display */}
              {error && (
                <div className="mt-6 p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl">
                  <p className="text-rose-700 dark:text-rose-400 text-center font-medium">
                    {error}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Help Text */}
          <div className="text-center mt-8">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Your question will be visible to the entire DebugDen community
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
