"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Filter, CheckCircle, XCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AppShell } from "@/components/app-shell";
import { auditLogs } from "@/lib/data";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function AuditLogsPage() {
  const [search, setSearch] = useState("");
  const [decisionFilter, setDecisionFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    return auditLogs.filter((log) => {
      const matchesSearch =
        search === "" ||
        log.request.toLowerCase().includes(search.toLowerCase()) ||
        log.vendor.toLowerCase().includes(search.toLowerCase()) ||
        log.decisionId.toLowerCase().includes(search.toLowerCase());
      const matchesDecision =
        decisionFilter === "all" || log.decision === decisionFilter;
      return matchesSearch && matchesDecision;
    });
  }, [search, decisionFilter]);

  return (
    <AppShell>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="space-y-6"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Audit Logs</h1>
          <p className="text-sm text-muted-foreground">
            Complete history of autonomous purchasing decisions and governance
            outcomes
          </p>
        </div>

        <Card className="border-border bg-card">
          <CardHeader className="border-b border-border pb-4">
            <div className="flex items-center justify-between gap-4">
              <CardTitle className="text-base font-semibold">
                Decision History
              </CardTitle>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search decisions..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-64 pl-9 bg-foreground/5 border-border text-sm"
                  />
                </div>
                <div className="flex items-center gap-1 rounded-md bg-foreground/5 p-0.5">
                  {["all", "approved", "violated"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setDecisionFilter(f)}
                      className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                        decisionFilter === f
                          ? "bg-foreground/10 text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="px-6 py-3 font-medium">Timestamp</th>
                    <th className="px-6 py-3 font-medium">Decision ID</th>
                    <th className="px-6 py-3 font-medium">Request</th>
                    <th className="px-6 py-3 font-medium">Vendor</th>
                    <th className="px-6 py-3 font-medium">Decision</th>
                    <th className="px-6 py-3 font-medium">Cost</th>
                    <th className="px-6 py-3 font-medium">Policy Result</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((log, i) => (
                    <motion.tr
                      key={log.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="transition-colors hover:bg-foreground/[0.02]"
                    >
                      <td className="whitespace-nowrap px-6 py-4 font-mono text-xs text-muted-foreground">
                        {new Date(log.timestamp).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        {new Date(log.timestamp).toLocaleTimeString("en-US", {
                          hour12: false,
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 font-mono text-xs">
                        {log.decisionId}
                      </td>
                      <td className="max-w-[200px] truncate px-6 py-4 text-sm">
                        {log.request}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                        {log.vendor}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <Badge
                          variant="secondary"
                          className={`text-[10px] ${
                            log.decision === "approved"
                              ? "bg-success-muted text-success"
                              : "bg-violation-muted text-violation"
                          }`}
                        >
                          {log.decision === "approved" ? (
                            <CheckCircle className="mr-1 h-3 w-3" />
                          ) : (
                            <XCircle className="mr-1 h-3 w-3" />
                          )}
                          {log.decision}
                        </Badge>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 font-mono text-sm font-bold">
                        ${log.cost}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <Badge
                          variant="secondary"
                          className={`text-[10px] ${
                            log.policyResult === "pass"
                              ? "bg-success-muted text-success"
                              : "bg-violation-muted text-violation"
                          }`}
                        >
                          {log.policyResult}
                        </Badge>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          {log.status === "completed" ? (
                            <CheckCircle className="h-3.5 w-3.5 text-success" />
                          ) : log.status === "blocked" ? (
                            <XCircle className="h-3.5 w-3.5 text-violation" />
                          ) : (
                            <Clock className="h-3.5 w-3.5 text-warning" />
                          )}
                          <span className="text-xs capitalize">{log.status}</span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && (
              <div className="py-12 text-center text-sm text-muted-foreground">
                No audit logs match your filters.
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AppShell>
  );
}
