"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuestionStore } from "@/store/Question";
import { useAuthStore } from "@/store/Auth";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Sparkles, Send } from "lucide-react";
import ParticleBackground from "../../components/ParticleBackground";
import { motion } from "framer-motion";

export default function NewQuestionPage() {
  const { user } = useAuthStore();
  const { addQuestion, error, loading } = useQuestionStore();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted && !user) {
      router.push("/login");
    }
  }, [mounted, user, router]);

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

  if (!mounted || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0B0C10]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0C10] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <ParticleBackground />
      <Navbar />

      <main className="relative z-10 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 mb-6"
            >
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Ask the Community
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4"
            >
              Post a Public Question
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
            >
              Get help from developers around the world. Be specific, add code
              snippets, and tag relevant technologies.
            </motion.p>
          </div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white/70 dark:bg-[#16181D]/70 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-2xl rounded-2xl overflow-hidden">
              <CardContent className="p-8 md:p-10">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Title Input */}
                  <div className="space-y-3">
                    <Label
                      htmlFor="title"
                      className="text-base font-semibold text-slate-900 dark:text-white"
                    >
                      Title
                    </Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Be specific and imagine you’re asking a question to
                      another person.
                    </p>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      disabled={loading}
                      placeholder="e.g. Is there an R function for finding the index of an element in a vector?"
                      className="h-12 bg-white dark:bg-black/20 border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-blue-500/50 rounded-xl text-lg"
                      required
                    />
                  </div>

                  {/* Content Input */}
                  <div className="space-y-3">
                    <Label
                      htmlFor="content"
                      className="text-base font-semibold text-slate-900 dark:text-white"
                    >
                      Details
                    </Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Introduce the problem and expand on what you put in the
                      title. Minimum 20 characters.
                    </p>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      disabled={loading}
                      placeholder="Describe your problem in detail..."
                      className="min-h-[250px] bg-white dark:bg-black/20 border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-blue-500/50 rounded-xl resize-y text-base leading-relaxed"
                      required
                    />
                  </div>

                  {/* Tags Input */}
                  <div className="space-y-3">
                    <Label
                      htmlFor="tags"
                      className="text-base font-semibold text-slate-900 dark:text-white"
                    >
                      Tags
                    </Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Add up to 5 tags to describe what your question is about
                      (comma separated).
                    </p>
                    <Input
                      id="tags"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      disabled={loading}
                      placeholder="e.g. javascript, react, css"
                      className="h-12 bg-white dark:bg-black/20 border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-blue-500/50 rounded-xl"
                    />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl text-rose-600 dark:text-rose-400 text-sm font-medium text-center">
                      {error}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-col-reverse sm:flex-row items-center gap-4 pt-4 border-t border-slate-200 dark:border-white/5">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => router.back()}
                      disabled={loading}
                      className="w-full sm:w-auto text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
                    >
                      Cancel
                    </Button>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto sm:ml-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-6 rounded-xl font-semibold shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                          Posting...
                        </>
                      ) : (
                        <>
                          <span>Post Question</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
