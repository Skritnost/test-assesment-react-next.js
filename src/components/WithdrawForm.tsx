"use client";

import { useWithdrawStore } from "@/store/withdrawStore";

export function WithdrawForm() {
  const {
    amount,
    destination,
    confirmed,
    status,
    error,
    withdrawal,
    setAmount,
    setDestination,
    setConfirmed,
    submit,
    resetForm,
  } = useWithdrawStore();

  const parsedAmount = parseFloat(amount);
  const isValid =
    amount !== "" &&
    !isNaN(parsedAmount) &&
    parsedAmount > 0 &&
    destination.trim() !== "" &&
    confirmed;

  const isSubmitting = status === "loading";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isSubmitting) return;
    submit();
  };

  if (status === "success" && withdrawal) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <h2 className="text-sm font-medium text-green-800">Withdrawal submitted</h2>
          <dl className="mt-2 space-y-1 text-sm text-green-700">
            <div className="flex justify-between">
              <dt>ID</dt>
              <dd className="font-mono">{withdrawal.id}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Amount</dt>
              <dd>{withdrawal.amount} USDT</dd>
            </div>
            <div className="flex justify-between">
              <dt>Destination</dt>
              <dd className="font-mono truncate ml-4 max-w-50">{withdrawal.destination}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Status</dt>
              <dd className="capitalize">{withdrawal.status}</dd>
            </div>
          </dl>
        </div>
        <button
          onClick={resetForm}
          className="w-full rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          New withdrawal
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

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
          disabled={isSubmitting}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
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
          disabled={isSubmitting}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          disabled={isSubmitting}
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
