import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { WithdrawForm } from "@/components/WithdrawForm";
import { useWithdrawStore } from "@/store/withdrawStore";
import * as api from "@/lib/api";

vi.mock("@/lib/api", () => ({
  postWithdrawal: vi.fn(),
  getWithdrawal: vi.fn(),
}));

const mockedApi = vi.mocked(api);

async function fillForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/amount/i), "100");
  await user.type(screen.getByLabelText(/destination/i), "0xabc123");
  await user.click(screen.getByLabelText(/confirm/i));
}

describe("WithdrawForm", () => {
  beforeEach(() => {
    useWithdrawStore.getState().resetForm();
    vi.clearAllMocks();
  });

  it("submits successfully and displays the withdrawal", async () => {
    mockedApi.postWithdrawal.mockResolvedValue({
      id: "w1",
      amount: 100,
      destination: "0xabc123",
      status: "pending",
      created_at: new Date().toISOString(),
    });
    mockedApi.getWithdrawal.mockResolvedValue({
      id: "w1",
      amount: 100,
      destination: "0xabc123",
      status: "processing",
      created_at: new Date().toISOString(),
    });

    const user = userEvent.setup();
    render(<WithdrawForm />);

    await fillForm(user);
    await user.click(screen.getByRole("button", { name: /withdraw/i }));

    await waitFor(() => {
      expect(screen.getByText(/withdrawal submitted/i)).toBeInTheDocument();
    });

    expect(screen.getByText("w1")).toBeInTheDocument();
    expect(screen.getByText("100 USDT")).toBeInTheDocument();
    expect(screen.getByText("processing")).toBeInTheDocument();
  });

  it("shows error message on API failure", async () => {
    mockedApi.postWithdrawal.mockRejectedValue(new Error("Network error"));

    const user = userEvent.setup();
    render(<WithdrawForm />);

    await fillForm(user);
    await user.click(screen.getByRole("button", { name: /withdraw/i }));

    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });

    expect(screen.getByLabelText(/amount/i)).toHaveValue(100);
    expect(screen.getByLabelText(/destination/i)).toHaveValue("0xabc123");
  });

  it("prevents double submit", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let resolvePost: (value: any) => void;
    mockedApi.postWithdrawal.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolvePost = resolve;
        })
    );

    const user = userEvent.setup();
    render(<WithdrawForm />);

    await fillForm(user);

    const button = screen.getByRole("button", { name: /withdraw/i });
    await user.click(button);
    await user.click(button);

    expect(mockedApi.postWithdrawal).toHaveBeenCalledTimes(1);

    resolvePost!({
      id: "w1",
      amount: 100,
      destination: "0xabc123",
      status: "pending",
      created_at: new Date().toISOString(),
    });
  });
});
