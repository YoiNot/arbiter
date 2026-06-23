"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShoppingCart,
  Shield,
  FileText,
  Settings,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/procurement", label: "Procurement Requests", icon: ShoppingCart },
  { href: "/policy-engine", label: "Policy Engine", icon: Shield },
  { href: "/audit-logs", label: "Audit Logs", icon: FileText },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-[oklch(0.09_0_0)]">
      <div className="flex h-16 items-center gap-3 border-b border-border px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-foreground/10">
          <Shield className="h-4 w-4 text-foreground" />
        </div>
        <span className="text-lg font-bold tracking-tight">ARBITER</span>
      </div>
      <nav className="mt-4 space-y-1 px-3">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-foreground/10 text-foreground"
                  : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="absolute bottom-0 left-0 right-0 border-t border-border p-4">
        <div className="flex items-center gap-3 rounded-lg bg-foreground/5 px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success-muted text-xs font-bold text-success">
            A
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium">System Active</p>
            <p className="text-[10px] text-muted-foreground">
              All policies enforced
            </p>
          </div>
          <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
        </div>
      </div>
    </aside>
  );
}
