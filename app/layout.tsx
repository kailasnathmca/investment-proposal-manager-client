// app/layout.tsx
// Defines the root layout for the entire application.
// Provides a consistent structure, including navigation and authentication context.

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// Metadata for the application, displayed in the browser tab.
export const metadata: Metadata = {
  title: "Investment Proposal Manager",
  description: "Manage investment proposals through their lifecycle.",
};

// The main layout component that wraps all pages.
// It includes the HTML structure, metadata, and renders child pages.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* The main content area where child pages will be rendered */}
        <main className="p-4">
          {children}
        </main>
      </body>
    </html>
  );
}