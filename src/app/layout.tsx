import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GG.AI Labs LeadFlow",
  description: "Plataforma de gestão de leads com integração WhatsApp e IA",
  keywords: ["WhatsApp", "Leads", "Dashboard", "Baileys", "CRM", "IA", "GG.AI Labs"],
  authors: [{ name: "GG.AI Labs" }],
  openGraph: {
    title: "GG.AI Labs LeadFlow",
    description: "Plataforma de gestão de leads com integração WhatsApp e IA",
    url: "https://www.ggailabs.com",
    siteName: "GG.AI Labs LeadFlow",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GG.AI Labs LeadFlow",
    description: "Plataforma de gestão de leads com integração WhatsApp e IA",
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
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <DashboardLayout>
            {children}
          </DashboardLayout>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
