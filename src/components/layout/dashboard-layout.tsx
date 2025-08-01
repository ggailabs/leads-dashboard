"use client";

import { ReactNode, useState, useEffect } from "react";
import { Sidebar } from "./sidebar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar isCollapsed={isCollapsed} />
      <div className="flex flex-col flex-1">
        <div className="flex flex-1 overflow-hidden">
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
        
        {/* Collapse Toggle Button */}
        {!isMobile && (
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "absolute top-1/2 transform -translate-y-1/2 z-10 h-16 w-3 rounded-r-lg rounded-l-none border-y border-r border-l-0 bg-background hover:bg-muted transition-all duration-300",
              isCollapsed ? "left-16" : "left-64"
            )}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
}