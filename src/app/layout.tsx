import type { Metadata } from "@/types/metadata";
import "./globals.css";

export const metadata: Metadata = {
  title: "Application Manager",
  description: "Manage your applications in one place",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
