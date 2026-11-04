import { describe, it, expect } from "vitest";
import { fireEvent } from "@testing-library/react";
import { renderWithProviders } from "../utils";
import { TalkToYourPapers } from "@/components/homepage/TalkToYourPapers";
import { MAP_VIEWBOX } from "@/components/homepage/portfolioMapGeometry";

const steps = (container: HTMLElement) =>
  Array.from(container.querySelectorAll("ol li button")) as HTMLButtonElement[];

describe("Talk to your papers", () => {
  it("offers four steps, opening on the map", () => {
    const { container } = renderWithProviders(<TalkToYourPapers />);
    const list = steps(container);
    expect(list).toHaveLength(4);
    expect(list[0].textContent).toContain("To start");
    expect(list[0].textContent).toContain("Your places, all in one view.");
    expect(list[3].textContent).toContain("Now, you ask");
  });

  it("opens the phone on the portfolio map, with counts and the highlighted place", () => {
    const { container } = renderWithProviders(<TalkToYourPapers />);
    expect(container.textContent).toContain("Every place you look after");
    expect(container.textContent).toContain("36 places · 214 papers read");
    const map = container.querySelector(`svg[viewBox="${MAP_VIEWBOX}"]`);
    expect(map).toBeTruthy();
    expect(map?.textContent).toContain("1 The Avenue");
    // the map asks nothing of you, so no composer is offered yet
    expect(container.textContent).not.toContain("Ask me about your papers");
  });

  it("hands the phone to the reading screen when a later step is chosen", () => {
    const { container } = renderWithProviders(<TalkToYourPapers />);
    fireEvent.click(steps(container)[3]);
    expect(container.textContent).toContain("When can the tenant at Units 1 & 2 break?");
    expect(container.textContent).toContain("Ask me about your papers");
    expect(container.querySelector(`svg[viewBox="${MAP_VIEWBOX}"]`)).toBeTruthy();
  });
});
