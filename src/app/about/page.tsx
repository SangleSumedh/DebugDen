"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import ParticleBackground from "../components/ParticleBackground";
import {
  Users,
  Target,
  Heart,
  Code2,
  Globe,
  Shield,
  Sparkles,
  ArrowRight,
  Zap,
} from "lucide-react";

export default function AboutPage() {
  const router = useRouter();

  const fadeInUp = {
    initial: { y: 60, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.6 },
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const features = [
    {
      icon: <Code2 className="w-6 h-6" />,
      title: "Learn by Doing",
      description:
        "Hands-on coding challenges and real-world projects to sharpen your skills.",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Community Driven",
      description:
        "Connect with fellow developers, share knowledge, and grow together.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Safe Space",
      description:
        "A supportive environment where all questions are welcome and respected.",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Reach",
      description:
        "Join developers from around the world in our vibrant community.",
    },
  ];

  // REPLACED: Fake stats with Real Core Values
  const values = [
    {
      value: "Open",
      label: "Source",
      icon: <GithubIcon className="w-6 h-6 mb-2 mx-auto text-slate-400" />,
    },
    {
      value: "Free",
      label: "Forever",
      icon: <Heart className="w-6 h-6 mb-2 mx-auto text-rose-500" />,
    },
    {
      value: "100%",
      label: "Transparent",
      icon: <Shield className="w-6 h-6 mb-2 mx-auto text-emerald-500" />,
    },
    {
      value: "Fast",
      label: "Performance",
      icon: <Zap className="w-6 h-6 mb-2 mx-auto text-yellow-500" />,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0C10] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <ParticleBackground />
      {/* <Navbar /> */}

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 z-10">
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 mb-8"
            >
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Empowering Developers Worldwide
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-slate-900 dark:text-white">
              About{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                DebugDen
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto mb-8 leading-relaxed">
              Where developers come together to learn, share, and grow.
              We&apos;re building the most supportive and inclusive community
              for programmers of all levels.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={() => router.push("/questions")}
                className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-6 rounded-xl text-lg font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all"
              >
                Explore Community
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/register")}
                className="border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-8 py-6 rounded-xl text-lg font-semibold hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
              >
                Join Now
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section (Replaced Stats) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-white/5 backdrop-blur-sm border-y border-slate-200 dark:border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {values.map((item) => (
              <motion.div
                key={item.label}
                variants={fadeInUp}
                className="text-center group"
              >
                <div className="transform group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-1">
                  {item.value}
                </div>
                <div className="text-slate-600 dark:text-slate-400 font-medium uppercase tracking-wide text-xs">
                  {item.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold mb-4 uppercase tracking-wider text-sm">
                <Target className="w-5 h-5" />
                Our Mission
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                Building the Future of Developer Education
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                At DebugDen, we believe that everyone should have access to
                quality programming education and a supportive community.
                We&apos;re committed to breaking down barriers and creating
                opportunities for developers at every stage of their journey.
              </p>

              <div className="space-y-4">
                {[
                  "Create a welcoming space for developers of all backgrounds",
                  "Foster collaborative learning and knowledge sharing",
                  "Empower developers to build amazing things together",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mt-1 flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">{item}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative z-10 bg-white/80 dark:bg-[#16181D]/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-slate-200 dark:border-white/10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Code2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-slate-900 dark:text-white">
                      Our Vision
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                      Since 2024
                    </p>
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                  To create a world where every developer has the tools,
                  community, and confidence to turn their ideas into reality. We
                  envision a future where learning to code is accessible,
                  collaborative, and endlessly inspiring.
                </p>
              </div>

              {/* Decorative blobs */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl -z-10" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Why Choose DebugDen?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              We&apos;ve built a platform that puts community and learning first
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="h-full bg-white/70 dark:bg-[#16181D]/70 backdrop-blur-xl border border-slate-200 dark:border-white/10 hover:border-blue-300 dark:hover:border-blue-500/50 transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-300 border border-slate-200 dark:border-white/10">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// Helper icon
function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}
