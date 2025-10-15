"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Rocket,
  Target,
  Heart,
  Code2,
  Globe,
  Shield,
  Sparkles,
  ArrowRight,
  Star,
  Github,
  Twitter,
  Linkedin,
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

  const stats = [
    { number: "10K+", label: "Active Developers" },
    { number: "50K+", label: "Questions Solved" },
    { number: "100+", label: "Countries" },
    { number: "24/7", label: "Support" },
  ];

  const team = [
    {
      name: "Alex Chen",
      role: "Founder & CEO",
      image: "/team-1.jpg",
      bio: "Former senior engineer with passion for education.",
      social: { twitter: "#", linkedin: "#", github: "#" },
    },
    {
      name: "Sarah Martinez",
      role: "Lead Developer",
      image: "/team-2.jpg",
      bio: "Full-stack developer and open source contributor.",
      social: { twitter: "#", linkedin: "#", github: "#" },
    },
    {
      name: "Marcus Johnson",
      role: "Community Manager",
      image: "/team-3.jpg",
      bio: "Tech evangelist and community builder.",
      social: { twitter: "#", linkedin: "#", github: "#" },
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950/20">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-800/50 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />

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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 mb-8"
            >
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                Empowering Developers Worldwide
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-slate-900 via-purple-600 to-blue-600 dark:from-slate-100 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                About DebugDen
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
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl text-lg font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all"
              >
                Explore Community
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/signup")}
                className="border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-8 py-3 rounded-xl text-lg font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                Join Now
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeInUp}
                className="text-center"
              >
                <div className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-600 dark:text-slate-400 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold mb-4">
                <Target className="w-5 h-5" />
                Our Mission
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                Building the Future of Developer Education
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                At DebugDen, we believe that everyone should have access to
                quality programming education and a supportive community.
                We&apos;re committed to breaking down barriers and creating
                opportunities for developers at every stage of their journey.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mt-1 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-green-600 dark:bg-green-400" />
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">
                    Create a welcoming space for developers of all backgrounds
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mt-1 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-green-600 dark:bg-green-400" />
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">
                    Foster collaborative learning and knowledge sharing
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mt-1 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-green-600 dark:bg-green-400" />
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">
                    Empower developers to build amazing things together
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative z-10 bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <Rocket className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      Our Vision
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Since 2024
                    </p>
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  To create a world where every developer has the tools,
                  community, and confidence to turn their ideas into reality. We
                  envision a future where learning to code is accessible,
                  collaborative, and endlessly inspiring.
                </p>
              </div>

              {/* Background decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-purple-500/10 rounded-full blur-xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-500/10 rounded-full blur-xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
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
                <Card className="h-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 hover:border-purple-300 dark:hover:border-purple-500 transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold mb-4">
              <Heart className="w-5 h-5" />
              Join Our Community
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              Ready to Level Up?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of developers who are already learning, sharing,
              and growing together in the most supportive programming community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={() => router.push("/register")}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all"
                size="lg"
              >
                Create Your Account
                <Star className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/questions")}
                className="border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                size="lg"
              >
                Browse Questions
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
