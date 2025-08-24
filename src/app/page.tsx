"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/Auth"; // adjust path if needed
import { useRouter } from "next/navigation";

export default function Home() {
  const [meteors, setMeteors] = useState<
    {
      top: string;
      left: string;
      animationDelay: string;
      animationDuration: string;
    }[]
  >([]);

  const { logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Generate meteors only on client → no hydration mismatch
    const generated = [...Array(12)].map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 20}s`,
      animationDuration: `${5 + Math.random() * 10}s`,
    }));
    setMeteors(generated);
  }, []);

  const handleLogout = () => {
    logout(); // clear session from store
    router.push("/login"); // redirect
  };

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Meteor Background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none overflow-hidden"
      >
        {meteors.map((style, i) => (
          <div key={i} className="meteor" style={style} />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold">🌌 Welcome to DebugDen</h1>
        <p className="mt-2 text-gray-400">Your debugging safe haven</p>

        {/* Logout Button */}
        <button
          onClick={() => handleLogout()}
          className="mt-6 px-5 py-2 rounded-2xl bg-red-600 hover:bg-red-700 transition shadow-lg"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
