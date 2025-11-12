import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://agentic-ad97c847.vercel.app"),
  title: {
    default: "Agentic Signal Survey",
    template: "%s | Agentic Signal Survey",
  },
  description:
    "Multi-step survey that converts intent into a launch-ready opportunity canvas inspired by Design Arena.",
  openGraph: {
    title: "Agentic Signal Survey",
    description:
      "Translate what you want into a focused launch plan with vibe, momentum, and roadmap insights.",
    url: "https://agentic-ad97c847.vercel.app",
    siteName: "Agentic Signal Survey",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Agentic Signal Survey",
    description:
      "Clarify what you want to ship next and share a tailored opportunity canvas.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-100`}
      >
        {children}
      </body>
    </html>
  );
}
