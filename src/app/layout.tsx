import type { Metadata, Viewport } from "next";
import { DM_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/components/ToastProvider";
import AIChatbot from "@/components/AIChatbot";
import CommandPalette from "@/components/CommandPalette";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#020817",
};

export const metadata: Metadata = {
  title: "SmartCart AI — India's #1 AI Price Comparison Tool",
  description:
    "Compare prices across Amazon & Flipkart instantly. AI-powered analysis saves you ₹1000s on every purchase.",
  keywords: "price comparison, Amazon India, Flipkart, AI shopping, deals, best price",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SmartCart AI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${ibmPlexMono.variable}`}
    >
      <body>
        <AuthProvider>
          <ToastProvider>
            {children}
            <AIChatbot />
            <CommandPalette />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
