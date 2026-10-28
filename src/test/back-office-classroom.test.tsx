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
