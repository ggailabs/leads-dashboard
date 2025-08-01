"use client";

import { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import Link from "next/link";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen">
      <Sidebar className="w-64 border-r" />
      <main className="flex-1 overflow-auto flex flex-col">
        <div className="flex-1 container mx-auto p-6">
          {children}
        </div>
        <footer className="border-t bg-muted/50 p-4">
          <div className="container mx-auto flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>© 2024 GG.AI Labs LeadFlow</span>
              <span>•</span>
              <span>Desenvolvido por</span>
              <Link 
                href="https://www.ggailabs.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                GG.AI Labs
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                href="https://www.ggailabs.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                www.ggailabs.com
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}