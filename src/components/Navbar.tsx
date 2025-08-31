"use client";

import { useAuthStore } from "@/store/Auth";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, Search } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const { session, logout } = useAuthStore();
  const router = useRouter();

  const handleAuth = () => {
    if (session) {
      logout();
      router.push("/login");
    } else {
      router.push("/login");
    }
  };

  return (
    <nav
      className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl bg-gradient-to-br from-slate-900 via-gray-900 to-indigo-950 border border-indigo-500/40 
                      rounded-2xl"
    >
      <div className="px-5 py-3 flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={() => router.push("/")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Image
            src="/debug-den.svg"
            alt="DebugDen Logo"
            width={34}
            height={34}
            className="rounded-md"
          />
          <span className="text-xl font-semibold tracking-wide text-white hover:text-purple-300 transition">
            DebugDen
          </span>
        </div>

        {/* Search */}
        <div className="hidden md:flex items-center gap-2 w-1/2 bg-white/5 rounded-xl px-3 py-1.5 border border-white/10">
          <Search className="w-4 h-4 text-gray-300" />
          <Input
            type="text"
            placeholder="Search questions..."
            className="bg-transparent border-none focus-visible:ring-0 text-sm text-white placeholder:text-gray-400"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button
            onClick={handleAuth}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 rounded-xl px-3 py-1.5 transition"
          >
            {session ? (
              <>
                <LogOut className="w-4 h-4 mr-1" /> Logout
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 mr-1" /> Login
              </>
            )}
          </Button>
        </div>
      </div>
    </nav>
  );
}
