import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import Prototype from "@/pages/Prototype";
import { SIDE_LETTER_ATTACHMENT_INSTRUCTION, SIDE_LETTER_FILENAME } from "@/components/prototype/workGuidance";

describe("Prototype conversation composer", () => {
  it("attaches the sample Side Letter from the ordinary chat and receives it through renewal guidance", async () => {
    const user = userEvent.setup();
    render(<Prototype />);

    await user.click(screen.getByRole("button", { name: "Attach a paper (sample Side Letter 2024.pdf)" }));
    expect(screen.getByLabelText("Guide Hobson about the tenancy renewal")).toHaveValue(SIDE_LETTER_ATTACHMENT_INSTRUCTION);
    expect(screen.getByLabelText(`Attached: ${SIDE_LETTER_FILENAME}`)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Send guidance" }));

    expect(screen.getByLabelText(`Attached paper: ${SIDE_LETTER_FILENAME}`)).toBeInTheDocument();
    expect(screen.getByText(/Thank you. I've received the Side Letter/)).toBeInTheDocument();
    expect(screen.queryByLabelText(`Attached: ${SIDE_LETTER_FILENAME}`)).not.toBeInTheDocument();
  });

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
