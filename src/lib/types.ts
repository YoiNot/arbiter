export interface Vendor {
  id: string;
  name: string;
  category: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  rating: number;
  complianceScore: number;
  policies: string[];
  status: "approved" | "pending" | "restricted";
}

export interface Policy {
  id: string;
  name: string;
  description: string;
  type: "spending" | "category" | "approval" | "vendor" | "budget";
  threshold?: number;
  currency?: string;
  allowed?: string[];
  restricted?: string[];
  minScore?: number;
  requiredCertifications?: string[];
  action: "violation" | "escalate" | "approve";
  severity: "critical" | "high" | "medium" | "low";
  enabled: boolean;
}

export interface AuditLog {
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
}

export interface PolicyCheck {
  policy: string;
  result: "pass" | "violation";
}

export interface VendorEvaluation {
  name: string;
  score: number;
  reasoning: string;
}

export interface RequestStage {
  name: string;
  status: "complete" | "in-progress" | "pending";
  output?: string[];
  vendors?: VendorEvaluation[];
  checks?: PolicyCheck[];
  violation?: {
    policy: string;
    reason: string;
    requiredAction: string;
  };
  decision?: "approved" | "violated";
  selectedVendor?: string;
  monthlyCost?: number;
  reason?: string;
  action?: string;
  paymentId?: string;
  executionStatus?: string;
  decisionId?: string;
  timestamp?: string;
}

export interface ProcurementRequest {
  id: string;
  title: string;
  description: string;
  budget: number;
  category: string;
  priority: "low" | "medium" | "high";
  agent: string;
  status: "completed" | "violated" | "in-progress" | "pending";
  createdAt: string;
  stages: RequestStage[];
}
