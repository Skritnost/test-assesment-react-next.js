import { create } from "zustand";
import { FormStatus, Withdrawal } from "@/lib/types";

interface WithdrawState {
  amount: string;
  destination: string;
  confirmed: boolean;
  status: FormStatus;
  error: string | null;
  withdrawal: Withdrawal | null;
  idempotencyKey: string;

  setAmount: (value: string) => void;
  setDestination: (value: string) => void;
  setConfirmed: (value: boolean) => void;
  resetForm: () => void;
  regenerateKey: () => void;

  setStatus: (status: FormStatus) => void;
  setError: (error: string | null) => void;
  setWithdrawal: (withdrawal: Withdrawal | null) => void;
}

export const useWithdrawStore = create<WithdrawState>((set) => ({
  amount: "",
  destination: "",
  confirmed: false,
  status: "idle",
  error: null,
  withdrawal: null,
  idempotencyKey: crypto.randomUUID(),

  setAmount: (value) => set({ amount: value }),
  setDestination: (value) => set({ destination: value }),
  setConfirmed: (value) => set({ confirmed: value }),

  resetForm: () =>
    set({
      amount: "",
      destination: "",
      confirmed: false,
      status: "idle",
      error: null,
      withdrawal: null,
      idempotencyKey: crypto.randomUUID(),
    }),

  regenerateKey: () => set({ idempotencyKey: crypto.randomUUID() }),

  setStatus: (status) => set({ status }),
  setError: (error) => set({ error }),
  setWithdrawal: (withdrawal) => set({ withdrawal }),
}));
