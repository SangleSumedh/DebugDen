import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Github,
  Twitter,
  Linkedin,
  Mail,
  Heart,
  ArrowRight,
} from "lucide-react";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full bg-slate-50 dark:bg-[#0B0C10] border-t border-slate-200 dark:border-white/10 transition-colors duration-300">
      {/* Optional: Top Glow Line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* 1. Brand Column */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center gap-2">
              <div className="relative w-8 h-8">
                <Image
                  src="/debug-den.svg"
                  alt="DebugDen Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                DebugDen
              </span>
            </div>

            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Join thousands of developers learning, sharing, and growing
              together in the most supportive programming community.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <SocialBtn
                href="https://github.com"
                icon={<Github className="w-4 h-4" />}
              />
              <SocialBtn
                href="https://twitter.com"
                icon={<Twitter className="w-4 h-4" />}
              />
              <SocialBtn
                href="https://linkedin.com"
                icon={<Linkedin className="w-4 h-4" />}
              />
              <SocialBtn
                href="mailto:contact@debugden.com"
                icon={<Mail className="w-4 h-4" />}
              />
            </div>
          </div>

          {/* 2. Platform Links */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-6">
              Platform
            </h4>
            <ul className="space-y-4 text-sm">
              <li>
                <FooterLink href="/questions">Browse Questions</FooterLink>
              </li>
              <li>
                <FooterLink href="/questions/new">Ask a Question</FooterLink>
              </li>
              <li>
                <FooterLink href="/tags" comingSoon>
                  Tags
                </FooterLink>
              </li>
              <li>
                <FooterLink href="/leaderboard" comingSoon>
                  Leaderboard
                </FooterLink>
              </li>
            </ul>
          </div>

          {/* 3. Company Links */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-6">
              Company
            </h4>
            <ul className="space-y-4 text-sm">
              <li>
                <FooterLink href="/about">About Us</FooterLink>
              </li>
              <li>
                <FooterLink href="/careers" comingSoon>
                  Careers
                </FooterLink>
              </li>
              <li>
                <FooterLink href="/privacy">Privacy Policy</FooterLink>
              </li>
              <li>
                <FooterLink href="/terms">Terms of Service</FooterLink>
              </li>
            </ul>
          </div>

          {/* 4. Resources Links (New Column) */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-6">
              Resources
            </h4>
            <ul className="space-y-4 text-sm">
              <li>
                <FooterLink href="/blog" comingSoon>
                  Blog
                </FooterLink>
              </li>
              <li>
                <FooterLink href="/docs" comingSoon>
                  API Docs
                </FooterLink>
              </li>
              <li>
                <FooterLink href="/community" comingSoon>
                  Community Guidelines
                </FooterLink>
              </li>
              <li>
                <FooterLink href="/support" comingSoon>
                  Support
                </FooterLink>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
              <span>© {currentYear} DebugDen. Made with</span>
              <Heart className="w-4 h-4 text-rose-500 fill-current animate-pulse" />
              <span>by Sumedh Sangle.</span>
            </div>

            <div className="flex gap-6 text-slate-500 dark:text-slate-500">
              <span>v1.0.0</span>
              <span>
                Server Status:{" "}
                <span className="text-emerald-500">● Online</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// --- Helper Components ---

function SocialBtn({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-9 h-9 flex items-center justify-center rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all duration-200"
    >
      {icon}
    </a>
  );
}

function FooterLink({
  href,
  children,
  comingSoon = false,
}: {
  href: string;
  children: React.ReactNode;
  comingSoon?: boolean;
}) {
  if (comingSoon) {
    return (
      <span className="flex items-center gap-2 text-slate-400 dark:text-slate-500 cursor-not-allowed">
        <span>{children}</span>
        <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-white/5">
          Soon
        </span>
      </span>
    );
  }

  return (
    <Link
      href={href}
      className="group flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
    >
      <ArrowRight className="w-3 h-3 opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
      <span>{children}</span>
    </Link>
  );
}

export default Footer;
