"use client";

import { useWithdrawStore } from "@/store/withdrawStore";

export function WithdrawForm() {
  const {
    amount,
    destination,
    confirmed,
    status,
    setAmount,
    setDestination,
    setConfirmed,
  } = useWithdrawStore();

  const parsedAmount = parseFloat(amount);
  const isValid =
    amount !== "" && !isNaN(parsedAmount) && parsedAmount > 0 && destination.trim() !== "" && confirmed;

  const isSubmitting = status === "loading";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isSubmitting) return;
    // API integration will be added in the next step
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
          Amount (USDT)
        </label>
        <input
          id="amount"
          type="number"
          step="any"
          min="0"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
          Destination address
        </label>
        <input
          id="destination"
          type="text"
          placeholder="0x..."
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          className="rounded border-gray-300"
        />
        I confirm this withdrawal
      </label>

      <button
        type="submit"
        disabled={!isValid || isSubmitting}
        className="w-full rounded-lg bg-blue-600 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        {isSubmitting ? "Submitting..." : "Withdraw"}
      </button>
    </form>
  );
}
