import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import BackOfficeClassroom from "@/pages/BackOfficeClassroom";

afterEach(cleanup);

it("each labelled area opens its own colleague", () => {
  const onOpen = vi.fn();
  render(<BackOfficeClassroom onOpen={onOpen} />);
  const map = { Permissions: "keeper", Contacts: "broker", Compliance: "inspector", Papers: "professor", Units: "architect" };
  for (const [section, id] of Object.entries(map)) {
    fireEvent.click(screen.getByRole("button", { name: section }));
    expect(onOpen).toHaveBeenLastCalledWith(id);
  }
  expect(screen.queryByRole("navigation", { name: "Back Office sections" })).toBeNull();
});

it("Hobson carries no name label but waves his own pointer layer", () => {
  const { container } = render(<BackOfficeClassroom />);
  const teacher = container.querySelector(".classroom-teacher");
  expect(teacher).not.toBeNull();
  // everyone knows Hobson: no popped-up label of any kind on him
  expect(teacher!.querySelector(".classroom-name")).toBeNull();
  expect(teacher!.textContent).toBe("");
  // his pointer sits on its own layer above his body, so it can wave
  expect(container.querySelectorAll(".classroom-hobson-stick")).toHaveLength(1);
  expect(screen.getByAltText("Hobson")).toBeTruthy();
});
