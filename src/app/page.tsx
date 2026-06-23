"use client";

import { motion } from "framer-motion";
import {
  Bot,
  DollarSign,
  ShieldAlert,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Zap,
  AlertTriangle,
  FileCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AppShell } from "@/components/app-shell";
import {
  auditLogs,
  getViolationCount,
  getApprovedCount,
  getTotalCapitalUnderGovernance,
} from "@/lib/data";

const kpiCards = [
  {
    label: "Autonomous Decisions",
    value: "1,247",
    change: "+12.4%",
    trend: "up" as const,
    icon: Bot,
    description: "Total AI decisions processed",
  },
  {
    label: "Capital Under Governance",
    value: `$${getTotalCapitalUnderGovernance().toLocaleString()}`,
    change: "+8.2%",
    trend: "up" as const,
    icon: DollarSign,
    description: "Monthly managed spend",
  },
  {
    label: "Policy Violations Prevented",
    value: getViolationCount().toString(),
    change: "+3 today",
    trend: "up" as const,
    icon: ShieldAlert,
    description: "Blocked by governance",
  },
  {
    label: "Approval Rate",
    value: "94.2%",
    change: "+0.3%",
    trend: "up" as const,
    icon: CheckCircle,
    description: "Within policy thresholds",
  },
];

const recentActivity = [
  {
    id: 1,
    type: "approved",
    icon: CheckCircle,
    title: "Purchase Approved",
    detail: "Fireflies — $39/mo for sales team transcription",
    time: "2 minutes ago",
    agent: "procurement-agent-001",
  },
  {
    id: 2,
    type: "violation",
    icon: AlertTriangle,
    title: "Policy Violation Detected",
    detail: "Enterprise CRM exceeds $500 autonomous limit",
    time: "15 minutes ago",
    agent: "procurement-agent-001",
  },
  {
    id: 3,
    type: "audit",
    icon: FileCheck,
    title: "Audit Record Generated",
    detail: "DEC-2025-005 — Security audit platform review",
    time: "1 hour ago",
    agent: "system",
  },
  {
    id: 4,
    type: "payment",
    icon: Zap,
    title: "Payment Intent Created",
    detail: "Stripe pi_3OxK2L2eZvKYlo2C — $12/mo",
    time: "2 hours ago",
    agent: "procurement-agent-001",
  },
  {
    id: 5,
    type: "escalation",
    icon: Clock,
    title: "Human Approval Requested",
    detail: "Legal contract management — restricted category",
    time: "3 hours ago",
    agent: "procurement-agent-001",
  },
];

const typeColors: Record<string, string> = {
  approved: "text-success bg-success-muted",
  violation: "text-violation bg-violation-muted",
  audit: "text-info bg-info-muted",
  payment: "text-warning bg-warning-muted",
  escalation: "text-warning bg-warning-muted",
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

export default function DashboardPage() {
  return (
    <AppShell>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="space-y-8"
      >
        <motion.div variants={fadeIn}>
          <h1 className="text-4xl font-bold tracking-tight">ARBITER</h1>
          <p className="mt-1 text-lg text-muted-foreground">
            Governance for Autonomous Commerce
          </p>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground/80">
            Enable AI agents to purchase, provision, and operate within
            enterprise policy.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {kpiCards.map((kpi) => (
            <motion.div key={kpi.label} variants={fadeIn}>
              <Card className="border-border bg-card transition-colors hover:border-foreground/15">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {kpi.label}
                      </p>
                      <p className="mt-2 text-3xl font-bold tracking-tight">
                        {kpi.value}
                      </p>
                    </div>
                    <div className="rounded-lg bg-foreground/5 p-2">
                      <kpi.icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-1.5">
                    {kpi.trend === "up" ? (
                      <ArrowUpRight className="h-3.5 w-3.5 text-success" />
                    ) : (
                      <ArrowDownRight className="h-3.5 w-3.5 text-violation" />
                    )}
                    <span className="text-xs font-medium text-success">
                      {kpi.change}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {kpi.description}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={fadeIn}>
          <Card className="border-border bg-card">
            <CardHeader className="border-b border-border pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">
                  Recent Activity
                </CardTitle>
                <Badge variant="secondary" className="text-xs">
                  Live
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {recentActivity.map((activity, i) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-foreground/[0.02]"
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${typeColors[activity.type]}`}
                    >
                      <activity.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {activity.detail}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-muted-foreground">
                        {activity.time}
                      </p>
                      <p className="font-mono text-[10px] text-muted-foreground/60">
                        {activity.agent}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AppShell>
  );
}
