import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { invoke } = vi.hoisted(() => ({ invoke: vi.fn() }));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    functions: { invoke },
  },
}));

import { PrototypeGate } from "@/components/prototype/PrototypeGate";

const SESSION_KEY = "hobson_prototype_open";

function renderGate() {
  return render(
    <PrototypeGate>
      <div>the demonstration</div>
    </PrototypeGate>
  );
}

function submitPhrase(value: string) {
  fireEvent.change(screen.getByLabelText("Pass phrase"), { target: { value } });
  fireEvent.click(screen.getByRole("button", { name: "Enter" }));
}

describe("PrototypeGate", () => {
  beforeEach(() => {
    invoke.mockReset();
    window.sessionStorage.clear();
    document.head.querySelectorAll('meta[name="robots"]').forEach((meta) => meta.remove());
  });

  it("keeps the demonstration hidden behind a quiet entrance", () => {
    renderGate();

    expect(screen.getByRole("heading", { name: "This room is private" })).toBeInTheDocument();
    expect(screen.queryByText("the demonstration")).not.toBeInTheDocument();
    expect(invoke).not.toHaveBeenCalled();
  });

  it("marks the page so search engines do not index it", () => {
    renderGate();

    const meta = document.head.querySelector('meta[name="robots"]');
    expect(meta?.getAttribute("content")).toBe("noindex, nofollow");
  });

  it("refuses an unrecognised pass phrase and stays shut", async () => {
    invoke.mockResolvedValue({ data: { valid: false }, error: null });
    renderGate();

    submitPhrase("not the phrase");

    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent("that isn't recognised")
    );
    expect(screen.queryByText("the demonstration")).not.toBeInTheDocument();
    expect(window.sessionStorage.getItem(SESSION_KEY)).toBeNull();
  });

  it("admits a correct pass phrase and remembers it for the visit", async () => {
    invoke.mockResolvedValue({ data: { valid: true }, error: null });
    renderGate();

    submitPhrase("the right phrase");

    await waitFor(() => expect(screen.getByText("the demonstration")).toBeInTheDocument());
    expect(invoke).toHaveBeenCalledWith(
      "prototype-gate",
      expect.objectContaining({ body: { passphrase: "the right phrase" } })
    );
    expect(window.sessionStorage.getItem(SESSION_KEY)).toBe("granted");
  });

  it("explains when too many attempts have been made", async () => {
    invoke.mockResolvedValue({
      data: null,
      error: { context: { status: 429 } },
    });
    renderGate();

    submitPhrase("guessing again");

    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent("Too many attempts")
    );
    expect(screen.queryByText("the demonstration")).not.toBeInTheDocument();
  });
});
