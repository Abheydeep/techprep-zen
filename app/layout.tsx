import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TechPrep Zen",
  description: "A focused DSA and system design interview preparation workspace",
  icons: {
    icon: "/icon.svg"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
