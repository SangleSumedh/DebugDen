import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/app/providers";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DebugDen",
  description: "Where developers come together to learn, share, and grow",
  icons: "/debug-den.svg",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative min-h-screen bg-gray-100 dark:bg-black text-black dark:text-white overflow-x-hidden`}
      >
        <ThemeProvider>
          <Navbar />
          {/* Main content with top padding so it doesn't overlap navbar */}
          <main className="">{children}</main>

          <Footer  />
        </ThemeProvider>
      </body>
    </html>
  );
}
