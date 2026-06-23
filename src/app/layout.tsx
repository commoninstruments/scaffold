import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";

import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  description:
    "The Howells baseline for project shape, tooling, package boundaries, agent workflow, deployment expectations, and launch readiness.",
  title: {
    default: "Scaffold",
    template: "%s | Scaffold",
  },
};

interface RootLayoutProps {
  readonly children: ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => (
  <html className={`${geistSans.variable} ${geistMono.variable}`} lang="en">
    <body>{children}</body>
  </html>
);

export default RootLayout;
