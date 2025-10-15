import React from "react";
import Link from "next/link";
import {
  Code2,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Heart,
  ArrowRight,
  MessageCircle,
} from "lucide-react";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full bg-gradient-to-br from-slate-50 to-blue-50/50 dark:from-slate-950 dark:to-blue-950/20 border-t border-slate-200/50 dark:border-slate-800/50">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                  DebugDen
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Where developers unite
                </p>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
              Join thousands of developers learning, sharing, and growing
              together in the most supportive programming community.
            </p>
            <div className="flex items-center gap-3">
              <button className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-cyan-100 dark:hover:bg-cyan-900/30 text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all duration-300 flex items-center justify-center">
                <Github className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 flex items-center justify-center">
                <Twitter className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 flex items-center justify-center">
                <Linkedin className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-6 text-lg">
              Platform
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/questions"
                  className="text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-200 flex items-center gap-2 group"
                >
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  Browse Questions
                </Link>
              </li>
              <li>
                <Link
                  href="/questions/new"
                  className="text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-200 flex items-center gap-2 group"
                >
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  Ask Question
                </Link>
              </li>
              
            </ul>
          </div>

          

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-6 text-lg">
              Quick Links
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/about"
                  className="text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-200 flex items-center gap-2 group"
                >
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  About Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section
        <div className="mt-16 pt-8 border-t border-slate-200/50 dark:border-slate-800/50">
          <div className="max-w-md">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4 text-lg flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-cyan-500" />
              Stay Updated
            </h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
              Get the latest updates, tips, and community news delivered to your
              inbox.
            </p>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
              />
              <button className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40">
                Subscribe
              </button>
            </div>
          </div>
        </div> */}
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm">
              <span>© {currentYear} DebugDen. Made with</span>
              <Heart className="w-4 h-4 text-rose-500 fill-current" />
              <span>for the developer community. - Sumedh Sangle</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
