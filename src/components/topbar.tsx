"use client";

import { Activity, Bell, Clock } from "lucide-react";

export function TopBar() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-[oklch(0.09_0_0)] px-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Activity className="h-3.5 w-3.5 text-success" />
          <span>All systems operational</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span className="font-mono">
            {new Date().toLocaleTimeString("en-US", {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </span>
        </div>
        <div className="relative">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <div className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-warning" />
        </div>
      </div>
    </header>
  );
}
