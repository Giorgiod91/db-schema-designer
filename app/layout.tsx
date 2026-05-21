import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const APP_URL = "https://db-schema-designer.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "DB Schema Designer — Free ER Diagram Tool",
    template: "%s | DB Schema Designer",
  },
  description:
    "Free browser-based database schema designer. Create ER diagrams visually, set primary and foreign keys, define 1:N / N:M relationships, and export to UMLet (.uxf). No sign-up required.",
  keywords: [
    "database schema designer",
    "ER diagram tool",
    "entity relationship diagram",
    "UMLet export",
    "free database tool",
    "visual database modelling",
    "Datenbankmodell",
    "ER Diagramm erstellen",
    "Datenbankschema Tool",
    "UMLet uxf",
  ],
  authors: [{ name: "Giorgio Dettmar", url: "https://giorgiodettmar.com" }],
  creator: "Giorgio Dettmar",
  openGraph: {
    type: "website",
    url: APP_URL,
    title: "DB Schema Designer — Free ER Diagram Tool",
    description:
      "Design database schemas visually in the browser. Set PK/FK, draw relationships with cardinality, export to UMLet.",
    siteName: "DB Schema Designer",
    images: [{ url: "/screenshot.png", width: 1440, height: 860, alt: "DB Schema Designer Screenshot" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DB Schema Designer — Free ER Diagram Tool",
    description: "Design database schemas visually. Free, no sign-up, export to UMLet.",
    images: ["/screenshot.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
