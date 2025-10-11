"use client";

import { useAuthStore } from "@/store/Auth";
import { useRouter, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, Search, Moon, Sun } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { useQuestionStore } from "@/store/Question";

export default function Navbar() {
  const { session, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const { searchQuestions, clearSearch } = useQuestionStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Hide Navbar on login/register pages
  const hiddenPaths = ["/login", "/register"];
  if (!mounted || hiddenPaths.includes(pathname)) return null;

  // Only show search on /questions path (home page)
  const showSearch = pathname === "/questions";

  const handleAuth = () => {
    if (session) {
      logout();
      router.push("/login");
    } else {
      router.push("/login");
    }
  };

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");
  if (theme === "dark") {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    searchQuestions(value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pathname !== "/questions") router.push("/questions");
    searchQuestions(searchInput);
  };

  const clearSearchInput = () => {
    setSearchInput("");
    clearSearch();
  };

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl z-50 shadow-lg shadow-cyan-200/10">
      {/* Animated Border Container */}
      <div className="relative rounded-2xl p-px bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 bg-[length:200%_100%] animate-gradient-shift">
        {/* Inner content with proper border radius */}
        <div className="relative bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl overflow-hidden">
          {/* Subtle inner glow */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none" />

          <div className="px-5 py-3 flex items-center justify-between relative z-10">
            {/* Brand */}
            <div
              onClick={() => {
                clearSearchInput();
                router.push("/");
              }}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="relative">
                <Image
                  src="/debug-den.svg"
                  alt="DebugDen Logo"
                  width={36}
                  height={36}
                  className="rounded-md group-hover:scale-110 transition-transform duration-200 relative z-10"
                />
                {/* Logo glow effect */}
                <div className="absolute inset-0 rounded-md bg-cyan-500/20 blur-md group-hover:bg-cyan-400/30 transition-all duration-300 scale-110 opacity-0 group-hover:opacity-100" />
              </div>
              <span className="text-xl font-bold tracking-wide text-slate-900 dark:text-white group-hover:text-cyan-500 dark:group-hover:text-purple-400 transition-colors duration-300">
                DebugDen
              </span>
            </div>

            {showSearch && (
              <form
                onSubmit={handleSearchSubmit}
                className="hidden md:flex items-center gap-2 w-1/2"
              >
                <div className="relative flex-1">
                  <div className="flex items-center gap-2 w-full bg-cyan-50/50 dark:bg-white/5 rounded-xl px-3 py-1.5 border border-cyan-200/40 dark:border-white/10 focus-within:ring-2 focus-within:ring-cyan-400 dark:focus-within:ring-purple-500 focus-within:shadow-lg focus-within:shadow-cyan-500/20 dark:focus-within:shadow-purple-500/20 transition-all duration-300">
                    <Search className="w-4 h-4 text-cyan-500 dark:text-purple-300 flex-shrink-0" />
                    <Input
                      type="text"
                      value={searchInput}
                      onChange={handleSearchChange}
                      placeholder="Search questions, tags, or users..."
                      className="flex-1 bg-transparent border-none focus-visible:ring-0 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-400"
                    />
                    {searchInput && (
                      <button
                        type="button"
                        onClick={clearSearchInput}
                        className="text-slate-400 hover:text-cyan-500 dark:hover:text-purple-400 transition-colors duration-200"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              </form>
            )}

            {/* Actions */}
            <div className="flex items-center gap-1">
              <Button
                onClick={() => router.push("/about")}
                variant="ghost"
                size="sm"
                className="text-slate-700 dark:text-white hover:bg-cyan-50 dark:hover:bg-purple-800 hover:text-cyan-600 dark:hover:text-purple-300 rounded-xl px-3 py-1.5 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 dark:hover:shadow-purple-500/10"
              >
                About
              </Button>
              <Button
                onClick={toggleTheme}
                variant="ghost"
                size="sm"
                className="w-9 h-9 p-0 text-slate-700 dark:text-gray-300 hover:bg-cyan-50 dark:hover:bg-purple-800 hover:text-cyan-600 dark:hover:text-purple-300 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 dark:hover:shadow-purple-500/10 relative group"
                title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              >
                {mounted ? (
                  <>
                    <Sun className="w-4 h-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 group-hover:scale-110" />
                    <Moon className="absolute w-4 h-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 group-hover:scale-110" />
                  </>
                ) : (
                  <Sun className="w-4 h-4" />
                )}
                <span className="sr-only">Toggle theme</span>
                {/* Theme toggle glow */}
                <div className="absolute inset-0 rounded-xl bg-cyan-500/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>

              <Button
                onClick={handleAuth}
                variant="ghost"
                size="sm"
                className="text-slate-700 dark:text-white hover:bg-cyan-50 dark:hover:bg-purple-800 hover:text-cyan-600 dark:hover:text-purple-300 rounded-xl px-3 py-1.5 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 dark:hover:shadow-purple-500/10"
              >
                {session ? (
                  <>
                    <LogOut className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform duration-200" />
                    Logout
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform duration-200" />
                    Login
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Global styles for the gradient animation */}
      <style jsx>{`
        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient-shift {
          animation: gradient-shift 3s ease infinite;
          background-size: 200% 200%;
        }
      `}</style>
    </nav>
  );
}
