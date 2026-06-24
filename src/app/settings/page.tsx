"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings, Shield, Bell, Key, Database, Save, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AppShell } from "@/components/app-shell";

interface SystemSettings {
  spendingThreshold: number;
  activePolicies: string[];
  orgName: string;
  enforcementMode: string;
  escalationChannel: string;
}

const policyDefinitions = [
  { id: "p1", name: "Maximum Autonomous Purchase Limit", severity: "critical" },
  { id: "p2", name: "Allowed Software Categories", severity: "high" },
  { id: "p3", name: "Human Approval Threshold", severity: "medium" },
  { id: "p4", name: "Vendor Compliance Requirements", severity: "high" },
  { id: "p5", name: "Budget Policy", severity: "critical" },
];

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => setSettings(data))
      .catch(() => {});
  }, []);

  const updateSettings = async (patch: Partial<SystemSettings>) => {
    if (!settings) return;
    const updated = { ...settings, ...patch };
    setSettings(updated);
    setSaving(true);
    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const togglePolicy = (policyId: string) => {
    if (!settings) return;
    const active = settings.activePolicies.includes(policyId)
      ? settings.activePolicies.filter((p) => p !== policyId)
      : [...settings.activePolicies, policyId];
    updateSettings({ activePolicies: active });
  };

  if (!settings) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
            <p className="text-sm text-muted-foreground">
              System configuration — changes affect the Hermes pipeline in real-time
            </p>
          </div>
          <Badge
            variant="secondary"
            className={`text-xs transition-colors ${
              saved
                ? "bg-success-muted text-success"
                : saving
                  ? "bg-warning-muted text-warning"
                  : "bg-muted text-muted-foreground"
            }`}
          >
            {saved ? "Saved" : saving ? "Saving..." : "All changes saved"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card className="border-border bg-card">
            <CardHeader className="border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-sm font-semibold">General</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex items-center justify-between px-5 py-3">
                <span className="text-sm text-muted-foreground">Organization Name</span>
                <span className="text-sm font-medium">{settings.orgName}</span>
              </div>
              <Separator className="bg-border/50" />
              <div className="flex items-center justify-between px-5 py-3">
                <span className="text-sm text-muted-foreground">System Mode</span>
                <Badge variant="secondary" className="text-[10px] bg-success-muted text-success">Production</Badge>
              </div>
              <Separator className="bg-border/50" />
              <div className="flex items-center justify-between px-5 py-3">
                <span className="text-sm text-muted-foreground">Enforcement</span>
                <Badge variant="secondary" className="text-[10px] bg-success-muted text-success">{settings.enforcementMode}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-sm font-semibold">Governance Threshold</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              <p className="text-xs text-muted-foreground mb-3">
                Purchases above this amount trigger policy violation and require human approval.
              </p>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">$</span>
                <input
                  type="number"
                  value={settings.spendingThreshold}
                  onChange={(e) => updateSettings({ spendingThreshold: parseInt(e.target.value) || 0 })}
                  className="w-32 rounded-md border border-border bg-foreground/5 px-3 py-2 text-sm font-mono font-bold focus:outline-none focus:ring-1 focus:ring-foreground/20"
                />
                <span className="text-sm text-muted-foreground">/month</span>
              </div>
              <p className="mt-2 text-[10px] text-muted-foreground/60">
                Current: Hermes will flag any request above ${settings.spendingThreshold}/mo
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card md:col-span-2">
            <CardHeader className="border-b border-border pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-sm font-semibold">Active Policies</CardTitle>
                </div>
                <Badge variant="secondary" className="text-[10px] bg-success-muted text-success">
                  {settings.activePolicies.length}/{policyDefinitions.length} Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {policyDefinitions.map((policy, i) => {
                const isActive = settings.activePolicies.includes(policy.id);
                return (
                  <div key={policy.id}>
                    <div className="flex items-center justify-between px-5 py-3">
                      <div className="flex items-center gap-3">
                        <span className="text-sm">{policy.name}</span>
                        <Badge
                          variant="secondary"
                          className={`text-[10px] ${
                            policy.severity === "critical"
                              ? "bg-violation-muted text-violation"
                              : policy.severity === "high"
                                ? "bg-warning-muted text-warning"
                                : "bg-info-muted text-info"
                          }`}
                        >
                          {policy.severity}
                        </Badge>
                      </div>
                      <button
                        onClick={() => togglePolicy(policy.id)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                          isActive ? "bg-success" : "bg-muted-foreground/30"
                        }`}
                        role="switch"
                        aria-checked={isActive}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform ${
                            isActive ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                    {i < policyDefinitions.length - 1 && (
                      <Separator className="bg-border/50" />
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-sm font-semibold">Integrations</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex items-center justify-between px-5 py-3">
                <span className="text-sm text-muted-foreground">Stripe</span>
                <Badge variant="secondary" className="text-[10px] bg-success-muted text-success">Connected</Badge>
              </div>
              <Separator className="bg-border/50" />
              <div className="flex items-center justify-between px-5 py-3">
                <span className="text-sm text-muted-foreground">Slack</span>
                <Badge variant="secondary" className="text-[10px] bg-success-muted text-success">Connected</Badge>
              </div>
              <Separator className="bg-border/50" />
              <div className="flex items-center justify-between px-5 py-3">
                <span className="text-sm text-muted-foreground">Escalation Channel</span>
                <span className="text-sm font-medium">{settings.escalationChannel}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-sm font-semibold">Data</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex items-center justify-between px-5 py-3">
                <span className="text-sm text-muted-foreground">Audit Retention</span>
                <span className="text-sm font-medium">90 days</span>
              </div>
              <Separator className="bg-border/50" />
              <div className="flex items-center justify-between px-5 py-3">
                <span className="text-sm text-muted-foreground">Data Region</span>
                <span className="text-sm font-medium">US East</span>
              </div>
              <Separator className="bg-border/50" />
              <div className="flex items-center justify-between px-5 py-3">
                <span className="text-sm text-muted-foreground">Export Format</span>
                <span className="text-sm font-medium">JSON / CSV</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </AppShell>
  );
}
