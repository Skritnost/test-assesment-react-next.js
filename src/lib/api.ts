import { Withdrawal } from "./types";

const API_BASE = "/v1";
const MOCK_DELAY = 800;

const usedIdempotencyKeys = new Set<string>();

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateId() {
  return crypto.randomUUID().split("-")[0];
}

export async function postWithdrawal(params: {
  amount: number;
  destination: string;
  idempotency_key: string;
}): Promise<Withdrawal> {
  await delay(MOCK_DELAY);

  if (usedIdempotencyKeys.has(params.idempotency_key)) {
    const error = new Error("This withdrawal has already been submitted.");
    (error as Error & { status: number }).status = 409;
    throw error;
  }

  usedIdempotencyKeys.add(params.idempotency_key);

  return {
    id: generateId(),
    amount: params.amount,
    destination: params.destination,
    status: "pending",
    created_at: new Date().toISOString(),
  };
}

export async function getWithdrawal(id: string): Promise<Withdrawal> {
  await delay(400);

  return {
    id,
    amount: 0,
    destination: "",
    status: "processing",
    created_at: new Date().toISOString(),
  };
}
