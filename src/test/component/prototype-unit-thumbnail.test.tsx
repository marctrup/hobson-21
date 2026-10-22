import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { PrototypeUnitPhotographs, UnitPhotoThumbnail } from "@/pages/PrototypeUnitPhotographs";
import type { UnitPhotographs } from "@/pages/prototypeUnitPhotos";

const photographed = (): UnitPhotographs & { name: string } => ({
  name: "First Floor Gym",
  photos: [{ id: "p1", name: "gym.jpg", url: "data:image/png;base64,AAA" }],
  mainPhotoId: "p1",
});

describe("Unit photograph thumbnail in a list", () => {
  it("opens the main photograph large when the thumbnail is chosen", async () => {
    const user = userEvent.setup();
    render(<UnitPhotoThumbnail unit={photographed()} />);
    const thumb = screen.getByRole("button", { name: "Enlarge First Floor Gym photograph" });
    await user.click(thumb);
    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByRole("img", { name: "First Floor Gym main photograph" })).toBeInTheDocument();
  });

  it("shows nothing when the Unit has no photograph", () => {
    render(<UnitPhotoThumbnail unit={{ name: "Second Floor Flat" }} />);
    expect(screen.queryByRole("button", { name: "Enlarge Second Floor Flat photograph" })).not.toBeInTheDocument();
  });

  it("shows a much larger photograph while the thumbnail is hovered, then hides it again", async () => {
    const user = userEvent.setup();
    render(<UnitPhotoThumbnail unit={photographed()} />);
    const thumb = screen.getByRole("button", { name: "Enlarge First Floor Gym photograph" });
    expect(screen.queryByRole("img", { name: "First Floor Gym photograph enlarged" })).not.toBeInTheDocument();
    await user.hover(thumb);
    expect(await screen.findByRole("img", { name: "First Floor Gym photograph enlarged" })).toBeInTheDocument();
    await user.unhover(thumb);
    expect(screen.queryByRole("img", { name: "First Floor Gym photograph enlarged" })).not.toBeInTheDocument();
  });

  it("shows a much larger photograph while a photograph in the list is hovered", async () => {
    const user = userEvent.setup();
    render(<PrototypeUnitPhotographs unit={photographed()} onChange={vi.fn()} />);
    await user.hover(screen.getByRole("button", { name: "Preview gym.jpg" }));
    expect(await screen.findByRole("img", { name: "gym.jpg enlarged" })).toBeInTheDocument();
  });
});
