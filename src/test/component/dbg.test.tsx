import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import Prototype from "@/pages/Prototype";

describe("dbg", () => {
  it("inspect", async () => {
    const user = userEvent.setup();
    const { container } = render(<Prototype />);
    const box = screen.getByLabelText("Ask Hobson") as HTMLInputElement;
    await user.type(box, "what is the rent?");
    console.log("VALUE:", JSON.stringify(box.value));
    const sends = screen.getAllByRole("button", { name: "Send" });
    console.log("SEND BUTTONS:", sends.length, sends.map(b => b.hasAttribute("disabled")));
    await user.click(sends[0]);
    await waitFor(() => expect(container.textContent).toContain("what is the rent?"), { timeout: 1500 }).catch(() => console.log("NO USER MSG"));
    console.log("HAS RENT TEXT:", container.textContent?.includes("rent"));
    console.log("SNIPPET:", container.textContent?.slice(0, 600));
    expect(1).toBe(1);
  });
});
