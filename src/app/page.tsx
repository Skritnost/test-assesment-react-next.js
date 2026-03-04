import { WithdrawForm } from "@/components/WithdrawForm";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-6">Withdraw USDT</h1>
        <WithdrawForm />
      </div>
    </main>
  );
}
