import { NextResponse } from "next/server";

interface HermesRequest {
  need: string;
  budget: number;
  category: string;
  priority: string;
}

const mockVendors: Record<string, Array<{ name: string; score: number; price: number; description: string; compliance: number }>> = {
  "Software": [
    { name: "Fireflies", score: 89, price: 39, description: "AI meeting transcription and notes", compliance: 92 },
    { name: "Otter", score: 84, price: 20, description: "Real-time transcription platform", compliance: 88 },
    { name: "Fathom", score: 78, price: 32, description: "AI meeting assistant", compliance: 85 },
  ],
  "Cloud Services": [
    { name: "AWS S3", score: 95, price: 45, description: "Cloud object storage", compliance: 98 },
    { name: "Google Cloud Storage", score: 91, price: 40, description: "Unified cloud storage", compliance: 96 },
    { name: "Azure Blob Storage", score: 88, price: 50, description: "Scalable cloud object storage", compliance: 94 },
  ],
  "Developer Tools": [
    { name: "Linear", score: 92, price: 8, description: "Issue tracking and project management", compliance: 90 },
    { name: "GitHub Copilot", score: 87, price: 19, description: "AI pair programmer", compliance: 86 },
    { name: "CodeRabbit", score: 80, price: 12, description: "AI code review automation", compliance: 82 },
  ],
  "Security": [
    { name: "Snyk", score: 94, price: 100, description: "Developer security platform", compliance: 96 },
    { name: "Vercel Analytics", score: 82, price: 20, description: "Web analytics and monitoring", compliance: 88 },
    { name: "Datadog", score: 90, price: 200, description: "Cloud monitoring and security", compliance: 95 },
  ],
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(request: Request) {
  const body: HermesRequest = await request.json();
  const { need, budget, category, priority } = body;

  const settingsRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/settings`);
  const settings = await settingsRes.json();
  const threshold = settings.spendingThreshold || 500;

  await delay(800 + Math.random() * 700);

  const vendors = mockVendors[category] || mockVendors["Software"];
  const filtered = vendors.filter((v) => v.price <= budget * 1.5);
  const candidates = filtered.length > 0 ? filtered : vendors;
  const selected = candidates.reduce((best, v) => (v.score > best.score ? v : best), candidates[0]);
  const isViolation = budget > threshold;

  const response = {
    traceId: `hermes-trace-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
    agent: "hermes-001",
    goal: need,
    constraints: [
      `Budget under $${budget}/month`,
      `${category} category`,
      `${priority} priority`,
    ],
    reasoning: [
      `Analyzing requirements for: ${need}`,
      `Filtering ${category} vendors within $${budget}/mo budget`,
      `Evaluating ${candidates.length} candidate vendors`,
      `Scoring based on feature fit, cost efficiency, compliance`,
      `Selected ${selected.name} — highest score (${selected.score}) within budget`,
    ],
    candidates: candidates.map((v) => ({
      name: v.name,
      score: v.score,
      price: v.price,
      compliance: v.compliance,
      reasoning: v.description,
    })),
    selectedVendor: {
      name: selected.name,
      score: selected.score,
      monthlyCost: selected.price,
      complianceScore: selected.compliance,
    },
    confidence: selected.score / 100,
    policyChecks: [
      { policy: "Budget Policy", result: budget <= 150 ? "pass" : "pass", checking: false },
      { policy: "Category Policy", result: settings.activePolicies?.includes("p2") ? "pass" : "skipped", checking: false },
      { policy: "Vendor Policy", result: settings.activePolicies?.includes("p4") ? "pass" : "skipped", checking: false },
      { policy: "Autonomous Purchase Limit", result: isViolation ? "violation" : "pass", checking: false },
    ],
    decision: isViolation ? "violated" : "approved",
    decisionReason: isViolation
      ? `Purchase exceeds autonomous spending threshold of $${threshold}/month`
      : `${selected.name} selected — highest compliance score (${selected.compliance}), within budget`,
    violation: isViolation
      ? {
          policy: "Autonomous Purchase Limit",
          reason: `Purchase exceeds autonomous spending threshold of $${threshold}/month`,
          requiredAction: "Human Approval Required",
        }
      : null,
  };

  return NextResponse.json(response);
}
