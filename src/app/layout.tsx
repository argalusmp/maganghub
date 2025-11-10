import type { Metadata } from "next";
import { Suspense } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { DonationAlert } from "@/components/donation/donation-alert";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "MagangYu — Temukan lowongan magang terbaik",
  description:
    "MagangYu menghadirkan pencarian magang modern dengan filter mendalam, analitik ringan, dan pengalaman yang dapat dibagikan.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="dark" suppressHydrationWarning>
      <body className={`${fontSans.variable} bg-zinc-950 text-zinc-50 antialiased`}>
        <QueryProvider>
          <div className="flex min-h-screen flex-col">
            <Suspense fallback={<div className="h-20 bg-zinc-950" />}>
              <SiteHeader />
            </Suspense>
            <main className="flex-1 bg-gradient-to-b from-zinc-950 via-zinc-950 to-zinc-900">
              {children}
            </main>
            <SiteFooter />
          </div>
          <DonationAlert />
        </QueryProvider>
      </body>
    </html>
  );
}
