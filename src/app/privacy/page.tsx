"use client";

import { motion } from "framer-motion";
import { Shield, Eye, Server, Cpu } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0C10] text-slate-900 dark:text-slate-100 transition-colors duration-300 flex flex-col">
      <main className="flex-grow relative z-10 pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </motion.div>

          {/* Content Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/70 dark:bg-[#16181D]/70 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-8 md:p-12 shadow-xl"
          >
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <Section title="1. Introduction">
                <p>
                  Welcome to <strong>DebugDen</strong> (&quot;we,&quot;
                  &quot;our,&quot; or &quot;us&quot;). We respect your privacy
                  and are committed to protecting your personal data. This
                  privacy policy will inform you as to how we look after your
                  personal data when you visit our website and tell you about
                  your privacy rights.
                </p>
              </Section>

              <Section title="2. The Data We Collect">
                <p>
                  We may collect, use, store and transfer different kinds of
                  personal data about you which we have grouped together
                  follows:
                </p>
                <ul className="list-disc pl-5 space-y-2 mt-4 text-slate-700 dark:text-slate-300">
                  <li>
                    <strong>Identity Data:</strong> Includes first name, last
                    name, username, and avatar image.
                  </li>
                  <li>
                    <strong>Contact Data:</strong> Includes email address.
                  </li>
                  <li>
                    <strong>Technical Data:</strong> Includes internet protocol
                    (IP) address, your login data, browser type and version, and
                    operating system.
                  </li>
                  <li>
                    <strong>Profile Data:</strong> Includes your username,
                    password (hashed), reputation score, and content you create
                    (Questions, Answers, Comments).
                  </li>
                </ul>
              </Section>

              <Section title="3. How We Use Your Data">
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <FeatureCard
                    icon={<Server className="w-5 h-5 text-blue-500" />}
                    title="Service Provision"
                    desc="To register you as a new user and manage your authentication state via Appwrite."
                  />
                  <FeatureCard
                    icon={<Eye className="w-5 h-5 text-purple-500" />}
                    title="Public Content"
                    desc="To display your questions and answers to the community. Please note this content is public."
                  />
                  <FeatureCard
                    icon={<Cpu className="w-5 h-5 text-emerald-500" />}
                    title="AI Generation"
                    desc="When you use AI features, the content of your question is sent to our AI provider to generate a draft."
                  />
                  <FeatureCard
                    icon={<Shield className="w-5 h-5 text-rose-500" />}
                    title="Security"
                    desc="To monitor for suspicious activity and keep the platform safe for all developers."
                  />
                </div>
              </Section>

              <Section title="4. Third-Party Services">
                <p>
                  We use the following third-party services to provide
                  functionality:
                </p>
                <ul className="list-disc pl-5 space-y-2 mt-4 text-slate-700 dark:text-slate-300">
                  <li>
                    <strong>Appwrite:</strong> For backend database,
                    authentication, and file storage.
                  </li>
                  <li>
                    <strong>Google OAuth:</strong> For authentication and
                    fetching your profile picture.
                  </li>
                  <li>
                    <strong>DiceBear:</strong> To generate default avatars based
                    on your username.
                  </li>
                  <li>
                    <strong>OpenAI/Gemini (AI Provider):</strong> To process
                    text for the &quot;Generate AI Answer&quot; feature.
                  </li>
                </ul>
              </Section>

              <Section title="5. Cookies and Local Storage">
                <p>
                  We use cookies and local storage to distinguish you from other
                  users of our website. This helps us to provide you with a good
                  experience when you browse our website and also allows us to
                  improve our site.
                </p>
                <p className="mt-2">
                  We specifically use <strong>Local Storage</strong> to save
                  your Theme preference (Light/Dark mode).
                </p>
              </Section>

              <Section title="6. Your Rights">
                <p>
                  Under certain circumstances, you have rights under data
                  protection laws in relation to your personal data, including
                  the right to:
                </p>
                <ul className="list-disc pl-5 space-y-2 mt-4 text-slate-700 dark:text-slate-300">
                  <li>Request access to your personal data.</li>
                  <li>Request correction of your personal data.</li>
                  <li>
                    Request erasure of your personal data (Delete Account).
                  </li>
                  <li>Object to processing of your personal data.</li>
                </ul>
              </Section>

              <div className="mt-12 pt-8 border-t border-slate-200 dark:border-white/10">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                  Contact Us
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  If you have any questions about this privacy policy, please
                  contact us at:{" "}
                  <a
                    href="mailto:sanglesumedh15@gmail.com"
                    className="text-blue-600 hover:underline"
                  >
                    sanglesumedh15@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

// --- Helper Components ---

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
        {title}
      </h2>
      <div className="text-slate-600 dark:text-slate-300 leading-relaxed">
        {children}
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-200 dark:border-white/5">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-white dark:bg-white/10 rounded-lg shadow-sm">
          {icon}
        </div>
        <h3 className="font-semibold text-slate-900 dark:text-white">
          {title}
        </h3>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400">{desc}</p>
    </div>
  );
}
