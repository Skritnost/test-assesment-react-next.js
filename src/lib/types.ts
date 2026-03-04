export type WithdrawalStatus = "pending" | "processing" | "completed" | "failed";

export interface Withdrawal {
  id: string;
  amount: number;
  destination: string;
  status: WithdrawalStatus;
  created_at: string;
}

export type FormStatus = "idle" | "loading" | "success" | "error";
