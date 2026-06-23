"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  CreditCard,
  FileText,
  Bot,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AppShell } from "@/components/app-shell";
import { requests } from "@/lib/data";

function StageIndicator({
  status,
}: {
  status: "complete" | "in-progress" | "pending";
}) {
  if (status === "complete")
    return <CheckCircle className="h-5 w-5 text-success" />;
  if (status === "in-progress")
    return (
      <div className="h-5 w-5 rounded-full border-2 border-warning animate-spin border-t-transparent" />
    );
  return <Clock className="h-5 w-5 text-muted-foreground/40" />;
}

function RequirementsStage({
  output,
}: {
  output: string[];
}) {
  return (
    <div className="space-y-2">
      {output?.map((item, i) => (
        <div
          key={i}
          className="flex items-center gap-2 rounded-md bg-foreground/5 px-3 py-1.5 text-sm"
        >
          <div className="h-1.5 w-1.5 rounded-full bg-info" />
          {item}
        </div>
      ))}
    </div>
  );
}

function VendorStage({
  vendors,
}: {
  vendors: { name: string; score: number; reasoning: string }[];
}) {
  return (
    <div className="space-y-2">
      {vendors?.map((v, i) => (
        <motion.div
          key={v.name}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className={`flex items-center justify-between rounded-md border px-3 py-2.5 text-sm ${
            i === 0
              ? "border-success/30 bg-success-muted"
              : "border-border bg-foreground/5"
          }`}
        >
          <div className="flex items-center gap-3">
            {i === 0 && (
              <Badge
                variant="secondary"
                className="bg-success-muted text-success text-[10px]"
              >
                TOP PICK
              </Badge>
            )}
            <span className="font-medium">{v.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-muted-foreground">
              {v.reasoning}
            </span>
            <span
              className={`font-mono text-sm font-bold ${
                i === 0 ? "text-success" : "text-muted-foreground"
              }`}
            >
              {v.score}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function GovernanceStage({
  checks,
  violation,
}: {
  checks: { policy: string; result: string }[];
  violation?: { policy: string; reason: string; requiredAction: string };
}) {
  return (
    <div className="space-y-3">
      {checks?.map((c, i) => (
        <motion.div
          key={c.policy}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08 }}
          className={`flex items-center justify-between rounded-md border px-3 py-2 text-sm ${
            c.result === "pass"
              ? "border-success/20 bg-success-muted"
              : "border-violation/30 bg-violation-muted"
          }`}
        >
          <span className="font-medium">{c.policy}</span>
          <span
            className={`font-mono text-xs font-bold uppercase ${
              c.result === "pass" ? "text-success" : "text-violation"
            }`}
          >
            {c.result}
          </span>
        </motion.div>
      ))}
      {violation && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 rounded-lg border-2 border-violation/40 bg-violation-muted p-4"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-violation" />
            <span className="text-sm font-bold uppercase text-violation">
              Policy Violation Detected
            </span>
          </div>
          <p className="mt-2 text-sm text-foreground/80">{violation.reason}</p>
          <p className="mt-1 text-xs text-warning">
            Required Action: {violation.requiredAction}
          </p>
        </motion.div>
      )}
    </div>
  );
}

function DecisionStage({
  decision,
  selectedVendor,
  monthlyCost,
  reason,
}: {
  decision: string;
  selectedVendor?: string;
  monthlyCost?: number;
  reason?: string;
}) {
  if (decision === "violated") return null;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-lg border-2 border-success/30 bg-success-muted p-4"
    >
      <div className="flex items-center gap-2">
        <CheckCircle className="h-5 w-5 text-success" />
        <span className="text-sm font-bold uppercase text-success">
          Approved
        </span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-xs text-muted-foreground">Selected Vendor</p>
          <p className="font-medium">{selectedVendor}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Monthly Cost</p>
          <p className="font-mono font-bold">${monthlyCost}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Reason</p>
          <p className="text-foreground/80">{reason}</p>
        </div>
      </div>
    </motion.div>
  );
}

function ExecutionStage({
  action,
  executionStatus,
}: {
  action?: string;
  executionStatus?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 rounded-md bg-foreground/5 px-3 py-2 text-sm">
        <CreditCard className="h-4 w-4 text-info" />
        <span className="font-medium">{action}</span>
      </div>
      <div className="flex items-center gap-2 rounded-md bg-foreground/5 px-3 py-2 text-sm">
        <span className="text-xs text-muted-foreground">Status:</span>
        <span className="font-medium">{executionStatus}</span>
      </div>
      <p className="text-xs text-muted-foreground/60 italic">
        This is a simulated action only. No real payments required.
      </p>
    </div>
  );
}

function AuditStage({
  decisionId,
  timestamp,
}: {
  decisionId?: string;
  timestamp?: string;
}) {
  return (
    <div className="rounded-md border border-border bg-foreground/5 p-3 font-mono text-xs">
      <div className="space-y-1">
        <p>
          <span className="text-muted-foreground">Decision ID:</span>{" "}
          {decisionId}
        </p>
        <p>
          <span className="text-muted-foreground">Timestamp:</span> {timestamp}
        </p>
        <p>
          <span className="text-muted-foreground">Vendor:</span> Fireflies
        </p>
        <p>
          <span className="text-muted-foreground">Cost:</span> $39/mo
        </p>
        <p>
          <span className="text-muted-foreground">Decision:</span> Approved
        </p>
        <p>
          <span className="text-muted-foreground">Policy Results:</span>{" "}
          All Pass
        </p>
      </div>
    </div>
  );
}

const stageIcons = [
  FileText,
  Bot,
  Shield,
  CheckCircle,
  CreditCard,
  FileText,
];

import { Shield } from "lucide-react";

function WorkflowPipeline({ request }: { request: (typeof requests)[0] }) {
  const [expandedStages, setExpandedStages] = useState<Set<number>>(
    new Set([0, 1, 2, 3, 4, 5])
  );

  const toggleStage = (index: number) => {
    setExpandedStages((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <div className="space-y-1">
      {request.stages.map((stage, i) => {
        const Icon = stageIcons[i] || FileText;
        const isExpanded = expandedStages.has(i);
        return (
          <div key={stage.name}>
            <button
              onClick={() => toggleStage(i)}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors hover:bg-foreground/5"
            >
              <StageIndicator status={stage.status} />
              <Icon className="h-4 w-4 text-muted-foreground" />
              <span className="flex-1 text-sm font-medium">{stage.name}</span>
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="ml-8 border-l border-border pb-3 pl-4 pt-1">
                    {stage.name === "Requirements Analysis" &&
                      stage.output && <RequirementsStage output={stage.output} />}
                    {stage.name === "Vendor Evaluation" &&
                      stage.vendors && <VendorStage vendors={stage.vendors} />}
                    {stage.name === "Governance Checks" &&
                      stage.checks && (
                        <GovernanceStage
                          checks={stage.checks}
                          violation={stage.violation}
                        />
                      )}
                    {stage.name === "Decision Engine" &&
                      stage.decision && (
                        <DecisionStage
                          decision={stage.decision}
                          selectedVendor={stage.selectedVendor}
                          monthlyCost={stage.monthlyCost}
                          reason={stage.reason}
                        />
                      )}
                    {stage.name === "Execution" && (
                      <ExecutionStage
                        action={stage.action}
                        executionStatus={stage.executionStatus}
                      />
                    )}
                    {stage.name === "Audit Trail" && (
                      <AuditStage
                        decisionId={stage.decisionId}
                        timestamp={stage.timestamp}
                      />
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {i < request.stages.length - 1 && (
              <div className="ml-5 border-l border-border/50" />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function ProcurementPage() {
  const [selectedRequest, setSelectedRequest] = useState(requests[0]);

  return (
    <AppShell>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Procurement Requests
          </h1>
          <p className="text-sm text-muted-foreground">
            Structured decision pipeline for AI-generated purchasing decisions
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-3 lg:col-span-1">
            {requests.map((req) => (
              <Card
                key={req.id}
                className={`cursor-pointer border-border bg-card transition-all hover:border-foreground/15 ${
                  selectedRequest.id === req.id
                    ? "border-foreground/20 ring-1 ring-foreground/10"
                    : ""
                }`}
                onClick={() => setSelectedRequest(req)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium">{req.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {req.description}
                      </p>
                    </div>
                    <Badge
                      variant={
                        req.status === "completed" ? "default" : "destructive"
                      }
                      className={`text-[10px] ${
                        req.status === "completed"
                          ? "bg-success-muted text-success"
                          : "bg-violation-muted text-violation"
                      }`}
                    >
                      {req.status}
                    </Badge>
                  </div>
                  <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                    <span>Budget: ${req.budget}/mo</span>
                    <span>Category: {req.category}</span>
                    <span className="capitalize">Priority: {req.priority}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-2">
            <Card className="border-border bg-card">
              <CardHeader className="border-b border-border pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold">
                      {selectedRequest.title}
                    </CardTitle>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Request ID: {selectedRequest.id.toUpperCase()} — Agent:{" "}
                      {selectedRequest.agent}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Workflow Pipeline
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <WorkflowPipeline request={selectedRequest} />
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </AppShell>
  );
}
