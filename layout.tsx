import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Levelock – Register. Compete. Claim the Crown.",
  description:
    "Levelock is a 3-day online gaming championship. Compete in intense elimination matches and battle for the crown.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#08080F] text-[#E8E8F0]">
        {children}
      </body>
    </html>
  );
}
