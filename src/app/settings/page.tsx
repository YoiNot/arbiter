"use client";

import { motion } from "framer-motion";
import { Settings, Shield, Bell, Key, Database } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AppShell } from "@/components/app-shell";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const settingsSections = [
  {
    title: "General",
    icon: Settings,
    items: [
      { label: "Organization Name", value: "Acme Corp", type: "text" },
      { label: "System Mode", value: "Production", type: "badge" },
      { label: "Timezone", value: "UTC", type: "text" },
    ],
  },
  {
    title: "Governance",
    icon: Shield,
    items: [
      { label: "Enforcement Mode", value: "Strict", type: "badge" },
      { label: "Auto-Approve Threshold", value: "$500", type: "text" },
      { label: "Escalation Channel", value: "Slack #procurement", type: "text" },
    ],
  },
  {
    title: "Notifications",
    icon: Bell,
    items: [
      { label: "Violation Alerts", value: "Enabled", type: "badge" },
      { label: "Approval Requests", value: "Enabled", type: "badge" },
      { label: "Daily Digest", value: "Enabled", type: "badge" },
    ],
  },
  {
    title: "Integrations",
    icon: Key,
    items: [
      { label: "Stripe", value: "Connected", type: "badge" },
      { label: "Slack", value: "Connected", type: "badge" },
      { label: "Jira", value: "Not Connected", type: "muted" },
    ],
  },
  {
    title: "Data",
    icon: Database,
    items: [
      { label: "Audit Retention", value: "90 days", type: "text" },
      { label: "Data Region", value: "US East", type: "text" },
      { label: "Export Format", value: "JSON / CSV", type: "text" },
    ],
  },
];

export default function SettingsPage() {
  return (
    <AppShell>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="space-y-6"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">
            System configuration and integration management
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {settingsSections.map((section) => (
            <Card key={section.title} className="border-border bg-card">
              <CardHeader className="border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <section.icon className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-sm font-semibold">
                    {section.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {section.items.map((item, i) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between px-5 py-3">
                      <span className="text-sm text-muted-foreground">
                        {item.label}
                      </span>
                      {item.type === "badge" ? (
                        <Badge
                          variant="secondary"
                          className={`text-[10px] ${
                            item.value === "Connected" ||
                            item.value === "Enabled" ||
                            item.value === "Strict" ||
                            item.value === "Production"
                              ? "bg-success-muted text-success"
                              : item.value === "Not Connected"
                                ? "bg-muted text-muted-foreground"
                                : ""
                          }`}
                        >
                          {item.value}
                        </Badge>
                      ) : (
                        <span className="text-sm font-medium">{item.value}</span>
                      )}
                    </div>
                    {i < section.items.length - 1 && (
                      <Separator className="bg-border/50" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </AppShell>
  );
}
