import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Stockr | Smart Business Assistant for Rwanda",
  description: "Turn your smartphone into a smart business assistant. EBM replacement, stock tracking, and RRA compliance for Rwandan entrepreneurs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans antialiased dark", geist.variable)}>
      <body className={cn("min-h-screen bg-background font-sans antialiased")}>
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}

