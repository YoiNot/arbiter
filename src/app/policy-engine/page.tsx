"use client";

import { motion } from "framer-motion";
import { Shield, DollarSign, Tag, Users, AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AppShell } from "@/components/app-shell";
import { policies } from "@/lib/data";

const policyIcons: Record<string, React.ElementType> = {
  spending: DollarSign,
  category: Tag,
  approval: Users,
  vendor: Shield,
  budget: AlertTriangle,
};

const severityColors: Record<string, string> = {
  critical: "bg-violation-muted text-violation",
  high: "bg-warning-muted text-warning",
  medium: "bg-info-muted text-info",
  low: "bg-success-muted text-success",
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

export default function PolicyEnginePage() {
  return (
    <AppShell>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="space-y-6"
      >
        <motion.div variants={fadeIn}>
          <h1 className="text-2xl font-bold tracking-tight">Policy Engine</h1>
          <p className="text-sm text-muted-foreground">
            Enterprise governance rules enforced on every autonomous decision
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {policies.map((policy) => {
            const Icon = policyIcons[policy.type] || Shield;
            return (
              <motion.div key={policy.id} variants={fadeIn}>
                <Card className="border-border bg-card transition-colors hover:border-foreground/15">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-foreground/5 p-2">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{policy.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {policy.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          Severity
                        </span>
                        <Badge
                          variant="secondary"
                          className={`text-[10px] ${severityColors[policy.severity]}`}
                        >
                          {policy.severity}
                        </Badge>
                      </div>

                      {policy.threshold !== undefined && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            Threshold
                          </span>
                          <span className="font-mono text-sm font-bold">
                            ${policy.threshold.toLocaleString()}/mo
                          </span>
                        </div>
                      )}

                      {policy.allowed && (
                        <div>
                          <span className="text-xs text-muted-foreground">
                            Allowed Categories
                          </span>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {policy.allowed.map((cat) => (
                              <Badge
                                key={cat}
                                variant="secondary"
                                className="bg-success-muted text-success text-[10px]"
                              >
                                {cat}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {policy.restricted && (
                        <div>
                          <span className="text-xs text-muted-foreground">
                            Restricted Categories
                          </span>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {policy.restricted.map((cat) => (
                              <Badge
                                key={cat}
                                variant="secondary"
                                className="bg-violation-muted text-violation text-[10px]"
                              >
                                {cat}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {policy.minScore !== undefined && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            Min Compliance Score
                          </span>
                          <span className="font-mono text-sm font-bold">
                            {policy.minScore}%
                          </span>
                        </div>
                      )}

                      {policy.requiredCertifications && (
                        <div>
                          <span className="text-xs text-muted-foreground">
                            Required Certifications
                          </span>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {policy.requiredCertifications.map((cert) => (
                              <Badge
                                key={cert}
                                variant="secondary"
                                className="bg-info-muted text-info text-[10px]"
                              >
                                {cert}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <Separator className="bg-border/50" />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          {policy.enabled ? (
                            <CheckCircle className="h-3.5 w-3.5 text-success" />
                          ) : (
                            <AlertTriangle className="h-3.5 w-3.5 text-muted-foreground/40" />
                          )}
                          <span className="text-xs text-muted-foreground">
                            {policy.enabled ? "Active" : "Disabled"}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-muted-foreground/50 uppercase">
                          {policy.action}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </AppShell>
  );
}
