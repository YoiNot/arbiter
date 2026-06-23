import vendorsData from "@/data/vendors.json";
import policiesData from "@/data/policies.json";
import auditLogsData from "@/data/auditLogs.json";
import requestsData from "@/data/requests.json";
import type { Vendor, Policy, AuditLog, ProcurementRequest } from "./types";

export const vendors: Vendor[] = vendorsData as Vendor[];
export const policies: Policy[] = policiesData as Policy[];
export const auditLogs: AuditLog[] = auditLogsData as AuditLog[];
export const requests: ProcurementRequest[] = requestsData as ProcurementRequest[];

export function getVendorById(id: string): Vendor | undefined {
  return vendors.find((v) => v.id === id);
}

export function getRequestById(id: string): ProcurementRequest | undefined {
  return requests.find((r) => r.id === id);
}

export function getAuditLogsByDecision(decision: string): AuditLog[] {
  return auditLogs.filter((l) => l.decision === decision);
}

export function getActivePolicies(): Policy[] {
  return policies.filter((p) => p.enabled);
}

export function getViolationCount(): number {
  return auditLogs.filter((l) => l.decision === "violated").length;
}

export function getApprovedCount(): number {
  return auditLogs.filter((l) => l.decision === "approved").length;
}

export function getTotalCapitalUnderGovernance(): number {
  return auditLogs
    .filter((l) => l.decision === "approved")
    .reduce((sum, l) => sum + l.cost, 0);
}
