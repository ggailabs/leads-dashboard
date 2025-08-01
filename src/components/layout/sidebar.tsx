"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  Home, 
  Smartphone, 
  Bot, 
  Settings, 
  MessageSquare, 
  Users, 
  Brain,
  Key,
  Zap,
  BarChart3
} from "lucide-react";

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    title: "Leads",
    href: "/leads",
    icon: Users,
  },
  {
    title: "WhatsApp",
    href: "/whatsapp",
    icon: Smartphone,
  },
  {
    title: "Agentes IA",
    href: "/agents",
    icon: Bot,
  },
  {
    title: "Provedores IA",
    href: "/ai-providers",
    icon: Brain,
  },
  {
    title: "Disparos IA",
    href: "/ai-campaigns",
    icon: Zap,
  },
  {
    title: "Mensagens",
    href: "/messages",
    icon: MessageSquare,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Configurações",
    href: "/settings",
    icon: Settings,
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn("pb-12 w-64", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <img 
                src="/ggailabs-logo.png" 
                alt="GG.AI Labs Logo" 
                className="w-8 h-8 mr-2"
              />
              <div>
                <h2 className="text-lg font-semibold">LeadFlow</h2>
                <p className="text-xs text-muted-foreground">by GG.AI Labs</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
          <div className="space-y-1">
            {sidebarNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Button
                  key={item.href}
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isActive && "bg-secondary"
                  )}
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}