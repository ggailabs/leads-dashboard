import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dashboard de Leads WhatsApp",
  description: "Acompanhe seus leads do WhatsApp em tempo real",
  keywords: ["WhatsApp", "Leads", "Dashboard", "Baileys", "CRM"],
  authors: [{ name: "Lead Dashboard Team" }],
  openGraph: {
    title: "Dashboard de Leads WhatsApp",
    description: "Acompanhe seus leads do WhatsApp em tempo real",
    url: "https://seu-dominio.com",
    siteName: "Lead Dashboard",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dashboard de Leads WhatsApp",
    description: "Acompanhe seus leads do WhatsApp em tempo real",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <DashboardLayout>
          {children}
        </DashboardLayout>
        <Toaster />
      </body>
    </html>
  );
}
