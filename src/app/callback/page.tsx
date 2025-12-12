"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/Auth";

// 1. Move logic to a child component
function CallbackContent() {
  const loadOAuthSession = useAuthStore((s) => s.loadOAuthSession);
  const router = useRouter();
  const params = useSearchParams();
  const hasError = params.get("error");

  useEffect(() => {
    if (hasError) {
      router.replace("/login?oauthError=1");
      return;
    }

    // Load session + user into Zustand
    loadOAuthSession().then(() => {
      router.replace("/questions");
    });
  }, [hasError, loadOAuthSession, router]);

  return (
    <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-[#0B0C10] text-lg text-slate-600 dark:text-slate-400">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        <p>Logging you in with Google...</p>
      </div>
    </div>
  );
}

// 2. Export the parent component with Suspense
export default function Callback() {
  return (
    <Suspense
      fallback={<div className="h-screen bg-slate-50 dark:bg-[#0B0C10]" />}
    >
      <CallbackContent />
    </Suspense>
  );
}
