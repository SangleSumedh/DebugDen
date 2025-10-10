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

  // Determine if search should be shown
  const nonSearchPaths = ["/about", "/community"];
  // Check if it's a question detail page
  const isQuestionDetail =
    pathname.startsWith("/questions/") && pathname.split("/").length === 3;
  const showSearch = !nonSearchPaths.includes(pathname) && !isQuestionDetail;

  const handleAuth = () => {
    if (session) {
      logout();
      router.push("/login");
    } else {
      router.push("/login");
    }
  };

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    searchQuestions(value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pathname !== "/") router.push("/");
    searchQuestions(searchInput);
  };

  const clearSearchInput = () => {
    setSearchInput("");
    clearSearch();
  };

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl z-50 shadow-lg shadow-cyan-200/10">
      <div className="px-5 py-3 flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={() => {
            clearSearchInput();
            router.push("/");
          }}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <Image
            src="/debug-den.svg"
            alt="DebugDen Logo"
            width={36}
            height={36}
            className="rounded-md group-hover:scale-110 transition-transform duration-200"
          />
          <span className="text-xl font-bold tracking-wide text-slate-900 dark:text-white group-hover:text-cyan-500 dark:group-hover:text-purple-400 transition-colors">
            DebugDen
          </span>
        </div>

        {showSearch && (
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center gap-2 w-1/2"
          >
            <div className="relative flex-1">
              <div className="flex items-center gap-2 w-full bg-cyan-50/50 dark:bg-white/5 rounded-xl px-3 py-1.5 border border-cyan-200/40 dark:border-white/10 focus-within:ring-2 focus-within:ring-cyan-400 dark:focus-within:ring-purple-500 transition-all">
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
                    className="text-slate-400 hover:text-cyan-500 dark:hover:text-purple-400 transition-colors"
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
            className="text-slate-700 dark:text-white hover:bg-cyan-50 dark:hover:bg-purple-800 rounded-xl px-3 py-1.5 transition"
          >
            About
          </Button>
          <Button
            onClick={toggleTheme}
            variant="ghost"
            size="sm"
            className="w-9 h-9 p-0 text-slate-700 dark:text-gray-300 hover:bg-cyan-50 dark:hover:bg-purple-800 rounded-xl transition"
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {mounted ? (
              <>
                <Sun className="w-4 h-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute w-4 h-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </>
            ) : (
              <Sun className="w-4 h-4" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Button
            onClick={handleAuth}
            variant="ghost"
            size="sm"
            className="text-slate-700 dark:text-white hover:bg-cyan-50 dark:hover:bg-purple-800 rounded-xl px-3 py-1.5 transition"
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
