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

    await user.type(box, "what is the rent?");
    await user.click(screen.getByRole("button", { name: "Send" }));

    expect(screen.getByText("what is the rent?")).toBeInTheDocument();
    await waitFor(
      () => expect(screen.getByText(/unit by unit/i)).toBeInTheDocument(),
      { timeout: 4000 }
    );
  });
});
