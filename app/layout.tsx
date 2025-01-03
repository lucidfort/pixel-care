import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { DoctorsProvider } from "@/context/DoctorsContext";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

import { Analytics } from "@vercel/analytics/react";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "PixelCare",
  description: "A health care management system",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-dark-300 font-sans antialiased",
          fontSans.className
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="dark">
          <DoctorsProvider>
            <main className="relative overflow-hidden">{children}</main>
          </DoctorsProvider>

          <Toaster />
        </ThemeProvider>

        <Analytics mode="production" />
      </body>
    </html>
  );
}
