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

export default function NewQuestionPage() {
  const { addQuestion, error, loading } = useQuestionStore();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return; // Prevent double submit

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-indigo-900 dark: dark:via-slate-900 dark:to-indigo-950 relative">
      <div className="relative max-w-5xl mx-auto p-6">
        <Navbar />
        {/* Spacer under navbar */}
        <div className="h-[15vh] w-full"></div>

        {/* Fullscreen Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <Card className="shadow-lg">
              <CardContent className="p-6 text-center">
                <p className="font-semibold text-lg">
                  Posting your question...
                </p>
                <p className="text-gray-500 text-sm mt-1">Please wait</p>
              </CardContent>
            </Card>
          </div>
        )}

        <Card
          className="bg-gradient-to-br from-slate-900 via-gray-900 to-indigo-950 border border-indigo-500/40 
                      shadow-[0_0_30px_rgba(99,102,241,0.5)]  rounded-2xl"
        >
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">
              Ask a Question
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2 text-white">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  type="text"
                  value={title}
                  disabled={loading}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a descriptive title"
                  required
                />
              </div>

              <div className="space-y-2 text-white">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={content}
                  disabled={loading}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Explain your problem in detail"
                  required
                  className="min-h-[140px]"
                />
              </div>

              <div className="space-y-2 text-white">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  type="text"
                  value={tags}
                  disabled={loading}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g. nextjs, react, tailwind"
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Posting..." : "Post Question"}
              </Button>
            </form>

            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
