import { NextResponse } from "next/server";

interface StripeRequest {
  vendor: string;
  amount: number;
  frequency: string;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(request: Request) {
  const body: StripeRequest = await request.json();
  const { vendor, amount, frequency } = body;

  await delay(500 + Math.random() * 300);

  const paymentIntentId = `pi_sim_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

  const response = {
    paymentIntentId,
    status: "succeeded" as const,
    amount: amount * 100,
    currency: "usd",
    vendor,
    frequency,
    created: Math.floor(Date.now() / 1000),
    livemode: false,
    metadata: {
      agent: "hermes-001",
      category: "software",
    },
  };

  return NextResponse.json(response);
}
