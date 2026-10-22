import { useState } from "react";
import { render, screen, within, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { PrototypeUnitDetails } from "@/pages/PrototypeUnitDetails";
import { mainUnitPhoto, removeUnitPhoto } from "@/pages/prototypeUnitPhotos";
import { proposeCounts } from "@/pages/prototypeUnitStructure";
import { setDetails, type DetailedUnit } from "@/pages/prototypeUnitDetails";

function Harness({ initial }: { initial?: DetailedUnit[] }) {
  const proposal = proposeCounts(11, 1);
  const [units, setUnits] = useState(initial ?? (proposal.kind === "proposal" ? proposal.units : []));
  const [open, setOpen] = useState<number | null>(1);
  const unit = units.find(u => u.number === open);
  return <>{unit ? <PrototypeUnitDetails unit={unit} units={units} groupName="Stanley House" onChange={setUnits} onBack={() => setOpen(null)} /> : units.map(u => <button key={u.number} onClick={() => setOpen(u.number)}>Open {u.name}</button>)}<output aria-label="Unit records">{JSON.stringify(units)}</output></>;
}
const records = () => JSON.parse(screen.getByLabelText("Unit records").textContent ?? "[]") as DetailedUnit[];
const base = () => { const result = proposeCounts(11, 1); if (result.kind !== "proposal") throw new Error(); return result.units; };

describe("Current Unit drafts and photographs", () => {
  it("copies Flat 2's unsaved description exactly to Flats 4, 6 and 8 and saves the source", async () => {
    const user = userEvent.setup(); render(<Harness />);
    await user.click(screen.getByRole("button", { name: "All Units in Stanley House" }));
    await user.click(screen.getByRole("button", { name: "Open Flat 2" }));
    const text = "Two-bedroom flat with a fitted kitchen.";
    await user.type(screen.getByLabelText("Description"), text);
    await user.click(screen.getByRole("button", { name: "Use this description for other Units" }));
    const panel = screen.getByLabelText("Use this description for other Units");
    expect(within(panel).getAllByRole("checkbox").every(input => !(input as HTMLInputElement).checked)).toBe(true);
    for (const n of [4, 6, 8]) await user.click(within(panel).getByRole("checkbox", { name: `Flat ${n}` }));
    expect(records()[1].details).toBeUndefined();
    await user.click(screen.getByRole("button", { name: "Apply this description to Flats 4, 6 and 8" }));
    for (const n of [2, 4, 6, 8]) expect(records()[n - 1].details?.description).toBe(text);
    await user.clear(screen.getByLabelText("Description"));
    await user.type(screen.getByLabelText("Description"), "Changed source");
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(records()[3].details?.description).toBe(text);
    for (const n of [4, 6, 8]) {
      await user.click(screen.getByRole("button", { name: "All Units in Stanley House" }));
      await user.click(screen.getByRole("button", { name: `Open Flat ${n}` }));
      expect(screen.getByLabelText("Description")).toHaveValue(text);
    }
  });

  it("copies only two bedrooms and one bathroom from the unsaved Flat 1 to Flats 3 and 5", async () => {
    const user = userEvent.setup();
    render(<Harness initial={setDetails(base(), 3, { area: 500, outsideSpace: "Yes", description: "Existing" })} />);
    await user.type(screen.getByLabelText("Floor area"), "750");
    await user.type(screen.getByLabelText("Double bedrooms"), "2");
    await user.type(screen.getByLabelText("Bathrooms"), "1");
    await user.click(within(screen.getByRole("group", { name: "Outside space" })).getByRole("button", { name: "No" }));
    await user.click(screen.getByRole("button", { name: "Apply details to other Units" }));
    const panel = screen.getByLabelText("Apply to other Units");
    expect(within(panel).queryByRole("checkbox", { name: /Single bedrooms/ })).toBeNull();
    for (const n of [3, 5]) await user.click(within(panel).getByRole("button", { name: `Flat ${n}` }));
    expect(records()[0].details).toBeUndefined();
    await user.click(within(panel).getByRole("button", { name: "Apply 4 changes" }));
    expect(records()[0].details).toEqual({ area: 750, areaUnit: "ft²", doubleBedrooms: 2, bathrooms: 1, outsideSpace: "No" });
    expect(records()[2].details).toEqual({ area: 500, outsideSpace: "Yes", description: "Existing", doubleBedrooms: 2, bathrooms: 1 });
    expect(records()[4].details).toEqual({ doubleBedrooms: 2, bathrooms: 1 });
  });

  it("requires approval to replace a different destination description", async () => {
    const user = userEvent.setup(); render(<Harness initial={setDetails(base(), 4, { description: "Original" })} />);
    await user.type(screen.getByLabelText("Description"), "New description");
    await user.click(screen.getByRole("button", { name: "Use this description for other Units" }));
    const panel = screen.getByLabelText("Use this description for other Units");
    await user.click(within(panel).getByRole("checkbox", { name: /^Flat 4/ }));
    expect(records()[3].details?.description).toBe("Original");
    expect(within(panel).getByRole("button", { name: "Choose Units" })).toBeDisabled();
    await user.click(within(panel).getByRole("checkbox", { name: /Replace Flat 4's/ }));
    await user.click(within(panel).getByRole("button", { name: "Apply this description to Flat 4" }));
    expect(records()[3].details?.description).toBe("New description");
  });

  it("keeps three uploaded Unit photographs and main selection when navigating away and back", async () => {
    const user = userEvent.setup(); render(<Harness />);
    const files = [1, 2, 3].map(n => new File([`image ${n}`], `photo-${n}.png`, { type: "image/png" }));
    await user.upload(screen.getByLabelText("Choose photographs for Flat 1"), files);
    await waitFor(() => expect(records()[0].photos).toHaveLength(3));
    await user.click(screen.getByRole("button", { name: "Make photo-2.png main photograph" }));
    await user.click(screen.getByRole("button", { name: "All Units in Stanley House" }));
    await user.click(screen.getByRole("button", { name: "Open Flat 3" }));
    expect(screen.queryByRole("img", { name: "photo-2.png" })).toBeNull();
    await user.click(screen.getByRole("button", { name: "All Units in Stanley House" }));
    await user.click(screen.getByRole("button", { name: "Open Flat 1" }));
    expect(screen.getByRole("button", { name: "Make photo-2.png main photograph" })).toHaveAttribute("aria-pressed", "true");
    expect(mainUnitPhoto(records()[0])?.name).toBe("photo-2.png");
    await user.click(screen.getByRole("button", { name: "Preview photo-2.png" }));
    expect(within(screen.getByRole("dialog")).getByRole("img", { name: "photo-2.png" })).toBeInTheDocument();
    await user.keyboard("{Escape}");
    await user.click(screen.getByRole("button", { name: "Remove photo-2.png" }));
    expect(records()[0].photos).toHaveLength(2);
    expect(mainUnitPhoto(records()[0])?.name).toBe("photo-1.png");
  });

  it("accepts a dropped photograph without changing other Units or the Unit Group cover", async () => {
    render(<Harness />);
    const group = { photo: { url: "group-cover", x: 50, y: 50, zoom: 1 }, units: base() };
    fireEvent.drop(screen.getByLabelText("Flat 1 photographs"), { dataTransfer: { files: [new File(["image"], "flat.png", { type: "image/png" })] } });
    await waitFor(() => expect(records()[0].photos).toHaveLength(1));
    group.units = records();
    expect(group.photo.url).toBe("group-cover");
    expect(group.units[1].photos).toBeUndefined();
    expect(removeUnitPhoto(group.units[0], group.units[0].photos?.[0]?.id ?? "").photos).toEqual([]);
  });
});