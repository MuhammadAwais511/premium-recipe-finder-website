import type { Metadata } from "next";

import { DM_Sans, Playfair_Display } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { ToastProvider } from "@/components/ui/ToastProvider";

const bodyFont = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const displayFont = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
});



export const metadata: Metadata = {
  title: {
    default: "Smart Recipe Finder | What's In My Kitchen?",
    template: "%s | What's In My Kitchen?",
  },
  description:
    "Discover delicious recipes, cook with ingredients you already have, and plan meals with confidence.",
  verification: {
    google: "wv_KcW_9amdQHJZLkvr_Cbkg2gg3JLhMadk88Hv9PRs",
  },
};


<meta name="google-site-verification" content="wv_KcW_9amdQHJZLkvr_Cbkg2gg3JLhMadk88Hv9PRs" />

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${bodyFont.variable} ${displayFont.variable} h-full scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased">
        <ThemeProvider>
          <ToastProvider>
            <Suspense fallback={<div className="h-20 border-b border-border/70 bg-background/92" />}>
              <Navbar />
            </Suspense>
            <div className="flex-1">{children}</div>
            <Footer />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
