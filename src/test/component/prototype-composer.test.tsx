import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import Prototype from "@/pages/Prototype";

describe("Prototype conversation composer", () => {
  it("opens an ordinary chat box with no locked notice and answers what you send", async () => {
    const user = userEvent.setup();
    render(<Prototype />);

    expect(screen.queryByText(/locked/i)).not.toBeInTheDocument();

    const box = screen.getByLabelText("Ask Hobson");
    expect(box).toBeEnabled();
    expect(box).toHaveValue("");

    await user.clear(box);
    await user.type(box, "what is the rent?");
    await user.click(screen.getByRole("button", { name: "Send" }));

    expect(screen.getByText("what is the rent?")).toBeInTheDocument();
    await waitFor(
      () => expect(screen.getByText(/unit by unit/i)).toBeInTheDocument(),
      { timeout: 4000 }
    );
  });

  it("does not route the retired Flat 2 question to its prepared rent answer", async () => {
    const user = userEvent.setup();
    render(<Prototype />);

    await user.type(screen.getByLabelText("Ask Hobson"), "rent flat 2 Nugent Terrace?");
    await user.click(screen.getByRole("button", { name: "Send" }));

    await waitFor(
      () => expect(screen.getByText(/unit by unit/i)).toBeInTheDocument(),
      { timeout: 4000 }
    );
    expect(screen.queryByText("£2,415 per month")).not.toBeInTheDocument();
  });
});
