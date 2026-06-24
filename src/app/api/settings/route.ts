import { NextResponse } from "next/server";

interface SystemSettings {
  spendingThreshold: number;
  activePolicies: string[];
  orgName: string;
  enforcementMode: string;
  escalationChannel: string;
}

let settings: SystemSettings = {
  spendingThreshold: 500,
  activePolicies: ["p1", "p2", "p3", "p4", "p5"],
  orgName: "Acme Corp",
  enforcementMode: "Strict",
  escalationChannel: "Slack #procurement",
};

export async function GET() {
  return NextResponse.json(settings);
}

export async function POST(request: Request) {
  const body = await request.json();
  settings = { ...settings, ...body };
  return NextResponse.json(settings);
}
