import { create } from "zustand";
import { FormStatus, Withdrawal } from "@/lib/types";
import { postWithdrawal, getWithdrawal } from "@/lib/api";

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
  submit: () => Promise<void>;
}

export const useWithdrawStore = create<WithdrawState>((set, get) => ({
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

  submit: async () => {
    const state = get();

    if (state.status === "loading") return;

    set({ status: "loading", error: null });

    try {
      const withdrawal = await postWithdrawal({
        amount: parseFloat(state.amount),
        destination: state.destination.trim(),
        idempotency_key: state.idempotencyKey,
      });

      const updated = await getWithdrawal(withdrawal.id);

      set({
        status: "success",
        withdrawal: { ...withdrawal, status: updated.status },
      });
    } catch (err) {
      const error = err as Error & { status?: number };

      if (error.status === 409) {
        set({
          status: "error",
          error: "This withdrawal has already been submitted.",
          idempotencyKey: crypto.randomUUID(),
        });
      } else {
        set({
          status: "error",
          error: "Network error. Please try again.",
        });
      }
    }
  },
}));
