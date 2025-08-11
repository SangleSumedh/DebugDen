"use client";

import { useAuthStore } from "@/store/Auth";
import { Loader2 } from "lucide-react";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function RegisterPage() {
  const { createAccount, login } = useAuthStore();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const firstname = formData.get("firstname");
    const lastname = formData.get("lastname");
    const email = formData.get("email");
    const password = formData.get("password");

    if (!firstname || !lastname || !email || !password) {
      setError("Please fill out all the fields");
      return;
    }

    setIsLoading(true);
    setError("");

    const response = await createAccount(
      `${firstname} ${lastname}`,
      email.toString(),
      password.toString()
    );

    if (response.error) {
      setError(response.error.message);
    } else {
      const loginResponse = await login(email.toString(), password.toString());

      if (loginResponse.error) {
        setError(loginResponse.error.message);
      } else {
        router.push("/dashboard"); // Redirect after successful registration
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white/10 backdrop-blur-lg shadow-xl p-8 border border-white/20">
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Create an Account
        </h1>
        <p className="text-gray-300 text-center mb-8">
          Fill in your details to get started
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="text-red-400 bg-red-400/10 border border-red-400/20 text-sm p-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                First Name
              </label>
              <input
                name="firstname"
                type="text"
                placeholder="John"
                className="w-full rounded-lg bg-white/5 border border-white/20 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Last Name
              </label>
              <input
                name="lastname"
                type="text"
                placeholder="Doe"
                className="w-full rounded-lg bg-white/5 border border-white/20 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-lg bg-white/5 border border-white/20 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              className="w-full rounded-lg bg-white/5 border border-white/20 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 transition-all duration-200 disabled:opacity-60"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Register"
            )}
          </button>
        </form>

        <p className="text-gray-400 text-sm text-center mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-400 hover:text-blue-300">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
