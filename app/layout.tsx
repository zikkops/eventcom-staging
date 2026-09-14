import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Eventcom",
  description:
    "We shape the energy behind every event — creating experiences that connect, inspire, and leave a lasting impact.",
};

// The public site's header, footer and stylesheet live in app/(site)/layout.tsx,
// so the admin panel under /admin renders without them.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
