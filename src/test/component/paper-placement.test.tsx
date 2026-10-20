import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { applyPaperAttachment, applyPaperPlacement, initialWorkGuidance, RENEWAL_PAPER_PLACE, SIDE_LETTER_ATTACHMENT_ID, SIDE_LETTER_ATTACHMENT_INSTRUCTION, type PaperPlace, type PaperPlacementAction } from "@/components/prototype/workGuidance";
import { WorkOverview } from "@/components/prototype/WorkOverview";
import { DocumentsLibrary } from "@/components/prototype/DocumentsLibrary";

const received = () => applyPaperAttachment(initialWorkGuidance, SIDE_LETTER_ATTACHMENT_INSTRUCTION, SIDE_LETTER_ATTACHMENT_ID).state;
const other: PaperPlace = { id: "stanley-f8", label: "Stanley House · Flat 8", kind: "Unit", propertyId: "stanley", unitId: "stanley-f8" };
const group: PaperPlace = { id: "stanley", label: "Stanley House", kind: "Unit Group", propertyId: "stanley" };

describe("Iteration 22 paper placement", () => {
  it("identifies Side Letter 2024.pdf with only a proposed Flat 6 location", () => {
    const paper = received().suppliedPapers[0];
    expect(paper.filename).toBe("Side Letter 2024.pdf");
    expect(paper.identifiedAs).toBe("Side Letter");
    expect(paper.proposedPlace.id).toBe("stanley-f6");
    expect(paper.filedPlace).toBeNull();
    expect(paper.tenancyLinked).toBe(false);
  });
  it("confirms filing separately from examination and keeps the source and renewal reference", () => {
    const state = applyPaperPlacement(received(), SIDE_LETTER_ATTACHMENT_ID, { type: "confirm" }).state;
    expect(state.suppliedPapers[0]).toMatchObject({ filedPlace: RENEWAL_PAPER_PLACE, tenancyLinked: true, review: "awaiting-examination", job: "Getting the tenancy renewal ready", sourceInstruction: SIDE_LETTER_ATTACHMENT_INSTRUCTION });
  });
  it("does not move or link the paper when another Unit is merely selected", () => {
    const state = applyPaperPlacement(received(), SIDE_LETTER_ATTACHMENT_ID, { type: "propose", place: other }).state;
    expect(state.suppliedPapers[0]).toMatchObject({ proposedPlace: other, filedPlace: null, tenancyLinked: false });
  });
  it.each([other, group])("requires confirmation and withholds the Flat 6 tenancy link for $kind", place => {
    const proposed = applyPaperPlacement(received(), SIDE_LETTER_ATTACHMENT_ID, { type: "propose", place }).state;
    const filed = applyPaperPlacement(proposed, SIDE_LETTER_ATTACHMENT_ID, { type: "confirm" }).state;
    expect(filed.suppliedPapers[0]).toMatchObject({ filedPlace: place, tenancyLinked: false, review: "awaiting-examination" });
  });
  it("keeps one record on repeated attachments and confirmations", () => {
    const state = applyPaperPlacement(received(), SIDE_LETTER_ATTACHMENT_ID, { type: "confirm" }).state;
    expect(applyPaperPlacement(state, SIDE_LETTER_ATTACHMENT_ID, { type: "confirm" }).state).toBe(state);
    const repeated = applyPaperAttachment(state, SIDE_LETTER_ATTACHMENT_INSTRUCTION, SIDE_LETTER_ATTACHMENT_ID).state;
    expect(repeated.suppliedPapers).toHaveLength(1);
    expect(repeated.suppliedPapers[0].tenancyLinked).toBe(true);
  });
  it("files through the Desk, retains the original findings and does not alter the draft", async () => {
    function Desk() {
      const [state, setState] = useState(received);
      const place = (id: string, action: PaperPlacementAction) => setState(s => applyPaperPlacement(s, id, action).state);
      return <WorkOverview onClose={vi.fn()} onGuide={vi.fn()} sideLetterRequested suppliedPapers={state.suppliedPapers} paperPlaces={[RENEWAL_PAPER_PLACE, other, group]} onPaperPlacement={place} />;
    }
    const user = userEvent.setup();
    render(<Desk />);
    await user.click(screen.getByRole("button", { name: "Getting the tenancy renewal ready" }));
    expect(screen.queryByRole("article", { name: "Side Letter — 2024" })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Choose somewhere else" }));
    await user.selectOptions(screen.getByLabelText("Choose a Unit or Unit Group"), "stanley-f8");
    await user.click(screen.getByRole("button", { name: "Keep with Flat 6 instead" }));
    await user.click(screen.getByRole("button", { name: "Yes, add it here" }));
    await user.click(screen.getByRole("button", { name: "Papers", exact: true }));
    expect(within(screen.getByRole("dialog")).getByRole("article", { name: "Supplied paper: Side Letter 2024.pdf" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Back to job" }));
    await user.click(screen.getByRole("button", { name: /Reviewed the rent/ }));
    expect(screen.getByText("£24,000")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Preview approval stage" }));
    expect(screen.getByRole("button", { name: "Approve and send" })).toBeEnabled();
    expect(screen.getByLabelText("Draft email preview")).not.toHaveTextContent("£24,000");
  });
  it("exposes a confirmed paper through the existing Papers library and never before filing", () => {
    const props = { onClose: vi.fn(), initialScope: { propertyId: "stanley", unitId: "stanley-f6" } };
    const { rerender } = render(<DocumentsLibrary {...props} suppliedPapers={received().suppliedPapers} />);
    expect(screen.queryByRole("article", { name: "Supplied paper: Side Letter 2024.pdf" })).not.toBeInTheDocument();
    const filed = applyPaperPlacement(received(), SIDE_LETTER_ATTACHMENT_ID, { type: "confirm" }).state;
    rerender(<DocumentsLibrary {...props} suppliedPapers={filed.suppliedPapers} />);
    expect(screen.getByRole("article", { name: "Supplied paper: Side Letter 2024.pdf" })).toBeInTheDocument();
  });
});