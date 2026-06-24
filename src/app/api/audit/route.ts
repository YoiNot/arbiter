import { NextResponse } from "next/server";

interface AuditRecord {
  id: string;
  decisionId: string;
  timestamp: string;
  request: string;
  agent: string;
  vendor: string;
  cost: number;
  decision: "approved" | "violated" | "pending";
  policyResult: "pass" | "violation";
  policyChecks: string[];
  status: "completed" | "blocked" | "pending";
  reason: string;
  hermesTraceId?: string;
  paymentIntentId?: string;
}

const auditStore: AuditRecord[] = [
  {
    id: "a1",
    decisionId: "DEC-2025-001",
    timestamp: "2025-01-15T14:32:00Z",
    request: "Meeting transcription for sales team",
    agent: "hermes-001",
    vendor: "Fireflies",
    cost: 39,
    decision: "approved",
    policyResult: "pass",
    policyChecks: ["Budget Policy PASS", "Category Policy PASS", "Vendor Policy PASS", "Spending Limit PASS"],
    status: "completed",
    reason: "Highest scoring vendor within budget and policy compliant",
    hermesTraceId: "hermes-trace-001",
    paymentIntentId: "pi_sim_001",
  },
  {
    id: "a2",
    decisionId: "DEC-2025-002",
    timestamp: "2025-01-14T09:15:00Z",
    request: "Project management tool for engineering",
    agent: "hermes-001",
    vendor: "Linear",
    cost: 8,
    decision: "approved",
    policyResult: "pass",
    policyChecks: ["Budget Policy PASS", "Category Policy PASS", "Vendor Policy PASS", "Spending Limit PASS"],
    status: "completed",
    reason: "Low-cost tool within all policy thresholds",
    hermesTraceId: "hermes-trace-002",
    paymentIntentId: "pi_sim_002",
  },
  {
    id: "a3",
    decisionId: "DEC-2025-003",
    timestamp: "2025-01-13T16:45:00Z",
    request: "Enterprise CRM platform",
    agent: "hermes-001",
    vendor: "Salesforce",
    cost: 1200,
    decision: "violated",
    policyResult: "violation",
    policyChecks: ["Budget Policy PASS", "Category Policy PASS", "Vendor Policy PASS", "Spending Limit VIOLATION"],
    status: "blocked",
    reason: "Exceeds autonomous spending threshold of $500/month",
    hermesTraceId: "hermes-trace-003",
  },
];

let idCounter = 4;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const decision = searchParams.get("decision");
  const search = searchParams.get("search");

  let results = [...auditStore];

  if (decision && decision !== "all") {
    results = results.filter((r) => r.decision === decision);
  }
  if (search) {
    const q = search.toLowerCase();
    results = results.filter(
      (r) =>
        r.request.toLowerCase().includes(q) ||
        r.vendor.toLowerCase().includes(q) ||
        r.decisionId.toLowerCase().includes(q)
    );
  }

  const summary = {
    totalDecisions: auditStore.length,
    approvedCount: auditStore.filter((r) => r.decision === "approved").length,
    violatedCount: auditStore.filter((r) => r.decision === "violated").length,
    totalCapital: auditStore
      .filter((r) => r.decision === "approved")
      .reduce((sum, r) => sum + r.cost, 0),
    todayDecisions: auditStore.filter(
      (r) => new Date(r.timestamp).toDateString() === new Date().toDateString()
    ).length,
  };

  return NextResponse.json({ logs: results, total: results.length, summary });
}

export async function POST(request: Request) {
  const body = await request.json();
  const id = `a${idCounter++}`;
  const decisionId = `DEC-2025-${String(idCounter).padStart(3, "0")}`;

  const record: AuditRecord = {
    id,
    decisionId,
    timestamp: new Date().toISOString(),
    request: body.request || "",
    agent: body.agent || "hermes-001",
    vendor: body.vendor || "",
    cost: body.cost || 0,
    decision: body.decision || "approved",
    policyResult: body.policyResult || "pass",
    policyChecks: body.policyChecks || [],
    status: body.status || "completed",
    reason: body.reason || "",
    hermesTraceId: body.hermesTraceId,
    paymentIntentId: body.paymentIntentId,
  };

  auditStore.push(record);

  return NextResponse.json(record);
}
