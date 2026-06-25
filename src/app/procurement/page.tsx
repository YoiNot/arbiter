"use client";

import { useState, useCallback } from "react";
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
  Sparkles,
  Shield,
  Play,
  Loader2,
  Zap,
  Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AppShell } from "@/components/app-shell";
import { requests } from "@/lib/data";
import type { RequestStage, ProcurementRequest, HermesResponse, StripeResponse } from "@/lib/types";

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

function RequirementsStage({ output }: { output: string[] }) {
  return (
    <div className="space-y-2">
      {output?.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center gap-2 rounded-md bg-foreground/5 px-3 py-1.5 text-sm"
        >
          <div className="h-1.5 w-1.5 rounded-full bg-info" />
          {item}
        </motion.div>
      ))}
    </div>
  );
}

function HermesTraceStage({
  trace,
}: {
  trace: NonNullable<RequestStage["hermesTrace"]>;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-md" />
          <div className="relative flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-3 w-3 text-primary" />
          </div>
        </div>
        <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary border-primary/20">
          Powered by Hermes
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-md border border-border bg-foreground/5 p-3">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1">Goal</p>
          <p className="text-sm">{trace.goal}</p>
        </div>
        <div className="rounded-md border border-border bg-foreground/5 p-3">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1">Decision Path</p>
          <p className="text-sm text-success">{trace.decisionPath}</p>
        </div>
      </div>

      <div className="rounded-md border border-border bg-foreground/5 p-3">
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-2">Constraints</p>
        <div className="flex flex-wrap gap-1.5">
          {trace.constraints.map((c, i) => (
            <Badge key={i} variant="secondary" className="text-[10px] bg-foreground/5">
              {c}
            </Badge>
          ))}
        </div>
      </div>

      <div className="rounded-md border border-border bg-foreground/5 p-3">
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-2">Candidates</p>
        <div className="flex flex-wrap gap-1.5">
          {trace.candidates.map((c, i) => (
            <Badge key={i} variant="secondary" className="text-[10px] bg-info-muted text-info">
              {c}
            </Badge>
          ))}
        </div>
      </div>

      <div className="rounded-md border border-border bg-foreground/5 p-3">
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-2">Evaluation Strategy</p>
        <div className="flex flex-wrap gap-1.5">
          {trace.strategy.map((s, i) => (
            <Badge key={i} variant="secondary" className="text-[10px] bg-foreground/5">
              {s}
            </Badge>
          ))}
        </div>
      </div>
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
            <span className="font-mono text-xs text-muted-foreground hidden md:block">
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

function StripeExecutionStage({
  stripe,
}: {
  stripe: NonNullable<RequestStage["stripe"]>;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-[#635bff]/20 blur-md" />
          <div className="relative flex h-6 w-6 items-center justify-center rounded-full bg-[#635bff]/10">
            <CreditCard className="h-3 w-3 text-[#635bff]" />
          </div>
        </div>
        <Badge variant="secondary" className="text-[10px] bg-[#635bff]/10 text-[#635bff] border-[#635bff]/20">
          Powered by Stripe
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="rounded-md border border-border bg-foreground/5 p-3">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1">Payment Intent</p>
          <p className="font-mono text-xs font-bold truncate">{stripe.paymentIntentId}</p>
        </div>
        <div className="rounded-md border border-border bg-foreground/5 p-3">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1">Vendor</p>
          <p className="text-sm font-medium">{stripe.vendor}</p>
        </div>
        <div className="rounded-md border border-border bg-foreground/5 p-3">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1">Amount</p>
          <p className="font-mono text-sm font-bold">${stripe.amount}/mo</p>
        </div>
        <div className="rounded-md border border-border bg-foreground/5 p-3">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1">Frequency</p>
          <p className="text-sm">{stripe.frequency}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-md bg-success-muted border border-success/20 px-3 py-2">
        <CheckCircle className="h-4 w-4 text-success" />
        <span className="text-sm font-medium text-success">{stripe.status}</span>
      </div>

      <p className="text-xs text-muted-foreground/60 italic">
        Simulated execution — no real payments processed.
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
      </div>
    </div>
  );
}

const stageIcons = [FileText, Sparkles, Bot, Shield, CheckCircle, CreditCard, FileText];

function WorkflowPipeline({ request }: { request: ProcurementRequest }) {
  const [expandedStages, setExpandedStages] = useState<Set<number>>(
    new Set(request.stages.map((_, i) => i))
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
                    {stage.name === "Hermes Decision Trace" &&
                      stage.hermesTrace && <HermesTraceStage trace={stage.hermesTrace} />}
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
                    {stage.name === "Stripe Execution" &&
                      stage.stripe && <StripeExecutionStage stripe={stage.stripe} />}
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

function AnimatedPipeline({ request }: { request: ProcurementRequest }) {
  const [visibleStages, setVisibleStages] = useState<number>(0);
  const [isRunning, setIsRunning] = useState(false);

  const runPipeline = useCallback(() => {
    setIsRunning(true);
    setVisibleStages(0);
    let current = 0;
    const interval = setInterval(() => {
      current++;
      setVisibleStages(current);
      if (current >= request.stages.length) {
        clearInterval(interval);
        setIsRunning(false);
      }
    }, 1000);
  }, [request.stages.length]);

  const visible = request.stages.slice(0, visibleStages);

  return (
    <div>
      {!isRunning && visibleStages === 0 && (
        <div className="text-center py-8 text-muted-foreground text-sm">
          Click &quot;Run Arbiter&quot; to simulate the autonomous decision pipeline
        </div>
      )}
      <div className="space-y-1">
        {visible.map((stage, i) => {
          const Icon = stageIcons[i] || FileText;
          const isLatest = i === visible.length - 1 && isRunning;
          return (
            <motion.div
              key={stage.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex w-full items-center gap-3 rounded-md px-3 py-2.5">
                {isLatest ? (
                  <div className="h-5 w-5 rounded-full border-2 border-warning animate-spin border-t-transparent" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-success" />
                )}
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span className="flex-1 text-sm font-medium">{stage.name}</span>
                {isLatest && (
                  <Badge variant="secondary" className="text-[10px] bg-warning-muted text-warning">
                    Processing
                  </Badge>
                )}
              </div>
              <div className="ml-8 border-l border-border/50" />
            </motion.div>
          );
        })}
      </div>
      {visibleStages >= request.stages.length && !isRunning && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 rounded-lg border-2 border-success/30 bg-success-muted p-4 text-center"
        >
          <CheckCircle className="h-6 w-6 text-success mx-auto mb-2" />
          <p className="text-sm font-bold text-success">Pipeline Complete</p>
          <p className="text-xs text-muted-foreground mt-1">
            All autonomous decision stages executed successfully
          </p>
        </motion.div>
      )}
    </div>
  );
}

const categories = ["Software", "Cloud Services", "Developer Tools", "Security"];
const priorities = ["low", "medium", "high"] as const;

export default function ProcurementPage() {
  const [selectedRequest, setSelectedRequest] = useState(requests[0]);
  const [simulatorRequest, setSimulatorRequest] = useState<ProcurementRequest | null>(null);
  const [need, setNeed] = useState("Code Review Tool");
  const [budget, setBudget] = useState("20");
  const [category, setCategory] = useState("Developer Tools");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [isLoading, setIsLoading] = useState(false);

  const runArbiter = async () => {
    if (!need.trim() || !budget.trim()) return;
    setIsLoading(true);

    try {
      const hermesRes = await fetch("/api/hermes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ need, budget: parseInt(budget), category, priority }),
      });
      const hermes: HermesResponse = await hermesRes.json();

      let stripeData: StripeResponse | null = null;
      if (hermes.decision === "approved") {
        const stripeRes = await fetch("/api/stripe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            vendor: hermes.selectedVendor.name,
            amount: hermes.selectedVendor.monthlyCost,
            frequency: "Monthly",
          }),
        });
        stripeData = await stripeRes.json();
      }

      const stages: RequestStage[] = [
        {
          name: "Requirements Analysis",
          status: "complete",
          output: hermes.constraints,
        },
        {
          name: "Hermes Decision Trace",
          status: "complete",
          hermesTrace: {
            goal: hermes.goal,
            constraints: hermes.constraints,
            candidates: hermes.candidates.map((c) => c.name),
            strategy: hermes.reasoning,
            decisionPath: hermes.decisionReason,
          },
        },
        {
          name: "Vendor Evaluation",
          status: "complete",
          vendors: hermes.candidates.map((c) => ({
            name: c.name,
            score: c.score,
            reasoning: c.reasoning,
          })),
        },
        {
          name: "Governance Checks",
          status: "complete",
          checks: hermes.policyChecks,
          ...(hermes.violation ? { violation: hermes.violation } : {}),
        },
      ];

      if (hermes.decision === "approved" && stripeData) {
        stages.push(
          {
            name: "Decision Engine",
            status: "complete",
            decision: "approved",
            selectedVendor: hermes.selectedVendor.name,
            monthlyCost: hermes.selectedVendor.monthlyCost,
            reason: hermes.decisionReason,
          },
          {
            name: "Stripe Execution",
            status: "complete",
            stripe: {
              paymentIntentId: stripeData.paymentIntentId,
              vendor: stripeData.vendor,
              amount: stripeData.amount / 100,
              frequency: stripeData.frequency,
              status: stripeData.status === "succeeded" ? "Ready for Execution" : "Processing",
            },
          },
          {
            name: "Audit Trail",
            status: "complete",
            decisionId: `DEC-2025-${String(Math.floor(Math.random() * 900) + 100)}`,
            timestamp: new Date().toISOString(),
          }
        );
      }

      const newRequest: ProcurementRequest = {
        id: `sim-${Date.now()}`,
        title: need,
        description: need,
        budget: parseInt(budget),
        category,
        priority,
        agent: hermes.agent,
        status: hermes.decision === "violated" ? "violated" : "completed",
        createdAt: new Date().toISOString(),
        stages,
      };

      setSimulatorRequest(newRequest);
      setSelectedRequest(newRequest);
    } catch (err) {
      console.error("Pipeline error:", err);
    } finally {
      setIsLoading(false);
    }
  };

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
            Autonomous governance pipeline — Hermes decides, Arbiter validates, Stripe executes
          </p>
        </div>

        <Card className="border-border bg-card">
          <CardHeader className="border-b border-border pb-4">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-warning" />
              <CardTitle className="text-base font-semibold">
                Create Autonomous Purchase Request
              </CardTitle>
            </div>
            <p className="text-xs text-muted-foreground">
              Submit a request and watch Hermes autonomously evaluate, govern, and execute
            </p>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
              <div className="md:col-span-2">
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Business Need</label>
                <input
                  type="text"
                  value={need}
                  onChange={(e) => setNeed(e.target.value)}
                  placeholder="Need a transcription solution for our sales team"
                  className="w-full rounded-md border border-border bg-foreground/5 px-3 py-2 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/20"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Budget ($/mo)</label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="150"
                  className="w-full rounded-md border border-border bg-foreground/5 px-3 py-2 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/20"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-md border border-border bg-foreground/5 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")}
                  className="w-full rounded-md border border-border bg-foreground/5 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
                >
                  {priorities.map((p) => (
                    <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={runArbiter}
                disabled={!need.trim() || !budget.trim() || isLoading}
                className="flex items-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                {isLoading ? "Processing..." : "Run Arbiter"}
              </button>
              <span className="text-xs text-muted-foreground">
                {isLoading ? "Hermes is reasoning..." : "7-stage autonomous pipeline — API-driven"}
              </span>
            </div>
          </CardContent>
        </Card>

        {simulatorRequest && (
          <Card className="border-border bg-card">
            <CardHeader className="border-b border-border pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">
                    Live Pipeline — {simulatorRequest.title}
                  </CardTitle>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Sequential autonomous evaluation in progress
                  </p>
                </div>
                <Badge variant="secondary" className="text-xs bg-warning-muted text-warning">
                  Simulated
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <AnimatedPipeline request={simulatorRequest} />
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-3 lg:col-span-1">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground px-1">
              Request History
            </p>
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
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Full Decision Trace
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
