import type { Metadata } from "next";
import { Geist, Geist_Mono, Press_Start_2P } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pixelFont = Press_Start_2P({
  variable: "--font-pixel",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BlockHost — Free Minecraft Server Hosting",
  description: "Spin up a free Minecraft server in seconds. Vanilla, Paper, Spigot, Forge, Fabric — all versions, no credit card required.",
  keywords: ["Minecraft server hosting", "free minecraft server", "minecraft host", "paper server", "spigot host", "forge server"],
  authors: [{ name: "BlockHost" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "BlockHost — Free Minecraft Server Hosting",
    description: "Spin up a free Minecraft server in seconds. Vanilla, Paper, Spigot, Forge, Fabric — all versions.",
    siteName: "BlockHost",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BlockHost — Free Minecraft Server Hosting",
    description: "Spin up a free Minecraft server in seconds.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pixelFont.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
        <SonnerToaster position="top-center" richColors />
      </body>
    </html>
  );
}
