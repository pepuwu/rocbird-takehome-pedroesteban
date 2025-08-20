"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, Users, UserCheck, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    href: "/",
    label: "Dashboard",
    icon: Home,
  },
  {
    href: "/talentos",
    label: "Talentos",
    icon: Users,
  },
  {
    href: "/referentes",
    label: "Referentes",
    icon: UserCheck,
  },
  {
    href: "/interacciones",
    label: "Interacciones",
    icon: Activity,
  },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <Card className="p-4">
      <nav className="space-y-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/" && pathname.startsWith(item.href));
          
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive && "bg-primary text-primary-foreground"
                )}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>
    </Card>
  );
}
