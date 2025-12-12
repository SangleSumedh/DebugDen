"use client";

import { useAuthStore } from "@/store/Auth";
import { useRouter, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {  LogOut, Search, Moon, Sun, User } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect, useRef } from "react";
import { useQuestionStore } from "@/store/Question";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
// Ensure next/image is imported
import Image from "next/image";

export default function Navbar() {
  // 1. Destructure fetchGoogleImage from store
  const { session, logout, user, fetchGoogleImage } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // 2. Add state for the avatar URL
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const { searchQuestions, clearSearch } = useQuestionStore();
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 3. Add Effect to load the real Google Avatar
  useEffect(() => {
    const loadRealAvatar = async () => {
      if (!user) return;

      // If we already saved it in prefs, use that
      if (user.prefs?.avatar) {
        setAvatarUrl(user.prefs.avatar);
        return;
      }

      // Otherwise fetch from Google
      const googleUrl = await fetchGoogleImage();
      if (googleUrl) {
        setAvatarUrl(googleUrl);
      }
    };

    loadRealAvatar();
  }, [user, fetchGoogleImage]);

  const hiddenPaths = ["/login", "/register"];
  if (!mounted || hiddenPaths.includes(pathname)) return null;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    searchQuestions(value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pathname !== "/") router.push("/");
    searchQuestions(searchInput);
    setIsSearchOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    setIsProfileOpen(false);
    router.push("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center py-4 px-4">
      {/* Main Glass Container */}
      <div className="w-full max-w-7xl bg-white/70 dark:bg-[#0B0C10]/80 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl shadow-xl shadow-black/5 dark:shadow-blue-900/5">
        <div className="px-5 py-3 flex items-center justify-between">
          {/* LEFT: Logo */}
          <div
            onClick={() => {
              setSearchInput("");
              clearSearch();
              router.push("/");
            }}
            className="flex items-center gap-2 cursor-pointer group"
          >
            {/* UPDATED: Using an SVG Logo instead of CSS placeholder */}
            <div className="relative w-8 h-8 transition-transform group-hover:scale-110">
              <Image
                src="/debug-den.svg"
                alt="DebugDen Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="hidden sm:block text-lg font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              DebugDen
            </span>
          </div>

          {/* CENTER: Desktop Search */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center gap-2 flex-1 max-w-md mx-8 group"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <Input
                type="text"
                value={searchInput}
                onChange={handleSearchChange}
                placeholder="Search questions..."
                className="pl-10 bg-slate-100/50 dark:bg-white/5 border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 rounded-xl transition-all"
              />
            </div>
          </form>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile Search Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-slate-600 dark:text-slate-400"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="w-5 h-5" />
            </Button>

            {/* Theme Toggle */}
            <Button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              variant="ghost"
              size="icon"
              className="text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl"
            >
              {theme === "light" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>

            {/* Auth State */}
            {session ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 ml-2 pl-2 border-l border-slate-200 dark:border-white/10"
                >
                  {/* User Avatar / Initials */}
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-[2px]">
                    <div className="w-full h-full rounded-full bg-white dark:bg-[#0B0C10] flex items-center justify-center overflow-hidden relative">
                      {/* 4. Updated Avatar Rendering Logic */}
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={user?.name || "User"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="font-bold text-xs text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
                          {user?.name
                            ? user.name.substring(0, 2).toUpperCase()
                            : "U"}
                        </span>
                      )}
                    </div>
                  </div>
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.1 }}
                      className="absolute right-0 mt-3 w-56 bg-white dark:bg-[#16181D] border border-slate-200 dark:border-white/10 rounded-xl shadow-xl overflow-hidden py-1"
                    >
                      <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                          {user?.name || "User"}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {user?.email}
                        </p>
                      </div>

                      <Link
                        href="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                      >
                        <User className="w-4 h-4" /> Profile
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <Button
                  onClick={() => router.push("/login")}
                  variant="ghost"
                  className="hidden sm:flex text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10"
                >
                  Log In
                </Button>
                <Button
                  onClick={() => router.push("/register")}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/20"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search Bar (Expandable) */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-slate-200 dark:border-white/10 overflow-hidden"
            >
              <form onSubmit={handleSearchSubmit} className="p-4">
                <Input
                  autoFocus
                  type="text"
                  value={searchInput}
                  onChange={handleSearchChange}
                  placeholder="Search topics..."
                  className="bg-slate-100/50 dark:bg-white/5 border-slate-200 dark:border-white/10"
                />
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
