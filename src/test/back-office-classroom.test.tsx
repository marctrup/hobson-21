import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import BackOfficeClassroom from "@/pages/BackOfficeClassroom";

afterEach(cleanup);

it("clicking a colleague opens nothing: the room answers to hover alone", () => {
  render(<BackOfficeClassroom introductions={ROSTER} />);
  const board = () => screen.getByRole("region", { name: "Hobson's whiteboard" }).querySelector(".sr-only")?.textContent ?? "";
  for (const section of ["Permissions", "Contacts", "Compliance", "Papers", "Units"]) {
    fireEvent.mouseEnter(screen.getByRole("button", { name: section }));
    fireEvent.click(screen.getByRole("button", { name: section }));
    expect(board()).toMatch(/^The /);
    fireEvent.mouseLeave(screen.getByRole("button", { name: section }));
    expect(board()).toMatch(/My Back Office will be opened to you soon/);
  }
  expect(screen.queryByRole("button", { name: /^Open / })).toBeNull();
  expect(screen.queryByRole("navigation", { name: "Back Office sections" })).toBeNull();
});

it("inspecting a colleague writes them on the board without opening their work", () => {
  render(<BackOfficeClassroom introductions={ROSTER} />);
  const board = () => screen.getByRole("region", { name: "Hobson's whiteboard" }).querySelector(".sr-only")?.textContent ?? "";
  fireEvent.mouseEnter(screen.getByRole("button", { name: "Contacts" }));
  fireEvent.focus(screen.getByRole("button", { name: "Papers" }));
  expect(board()).toMatch(/^The Professor\./);
  expect(screen.queryByRole("button", { name: /^Open / })).toBeNull();
});

const ROSTER = [
  { id: "keeper", contribution: "I keep watch over who may see and change what." },
  { id: "broker", contribution: "I maintain the people and organisations connected to your portfolio." },
  { id: "inspector", contribution: "I compare what is known against what is required." },
  { id: "professor", contribution: "I maintain everything Hobson knows from your documents." },
  { id: "architect", contribution: "I keep the structure of your estate accurate." },
];

it("the board carries Hobson's invitation until a colleague takes the pen", () => {
  render(<BackOfficeClassroom introductions={ROSTER} />);
  const board = () => screen.getByRole("region", { name: "Hobson's whiteboard" }).querySelector(".sr-only")?.textContent ?? "";
  expect(board()).toMatch(/^Hobson\. My Back Office will be opened to you soon\./);
  expect(board()).toMatch(/To introduce my team please hover over them so they can introduce themselves to you/);
});

it("Hobson himself is no longer a target, while his colleagues keep theirs", () => {
  render(<BackOfficeClassroom introductions={ROSTER} />);
  const board = () => screen.getByRole("region", { name: "Hobson's whiteboard" }).querySelector(".sr-only")?.textContent ?? "";
  expect(screen.queryByRole("button", { name: "Hobson" })).toBeNull();
  fireEvent.mouseEnter(screen.getByRole("button", { name: "Papers" }));
  expect(board()).toMatch(/^The Professor\. I maintain everything Hobson knows from your documents/);
  fireEvent.mouseLeave(screen.getByRole("button", { name: "Papers" }));
  expect(board()).toMatch(/My Back Office will be opened to you soon/);
  fireEvent.click(screen.getByRole("button", { name: "Papers" }));
  expect(board()).toMatch(/My Back Office will be opened to you soon/);
});



/** The staff room (narrow workspace) writes each colleague onto the board as you reach them. */
function inStaffRoom(rendered: () => void) {
  const proto = Element.prototype;
  const sizes = ["clientWidth", "clientHeight"] as const;
  const values = { clientWidth: 320, clientHeight: 700 } as const;
  const saved = sizes.map((k) => Object.getOwnPropertyDescriptor(proto, k));
  const observer = globalThis.ResizeObserver;
  class Stub {
    cb: (entries: unknown[]) => void;
    constructor(cb: (entries: unknown[]) => void) { this.cb = cb; }
    observe(el: unknown) { this.cb([el]); }
    unobserve() {}
    disconnect() {}
  }
  globalThis.ResizeObserver = Stub as unknown as typeof ResizeObserver;
  sizes.forEach((k) => Object.defineProperty(proto, k, { configurable: true, value: values[k] }));
  try { rendered(); } finally {
    sizes.forEach((k, i) => {
      const d = saved[i];
      if (d) Object.defineProperty(proto, k, d);
      else delete (proto as unknown as Record<string, unknown>)[k];
    });
    globalThis.ResizeObserver = observer;
  }
}


it("the staff room writes a colleague's own words on the board when you reach them", () => {
  const board = () => document.querySelector(".compact-board .sr-only")?.textContent ?? "";
  inStaffRoom(() => {
    render(<BackOfficeClassroom introductions={ROSTER} />);
    expect(screen.queryByText(/each colleague in turn/i)).not.toBeInTheDocument();
    expect(board()).toMatch(/^Hobson\./);
    fireEvent.mouseEnter(screen.getByRole("button", { name: "Papers" }));
    expect(board()).toMatch(/^The Professor\. I maintain everything Hobson knows from your documents/);
    fireEvent.click(screen.getByRole("button", { name: "Papers" }));
    expect(screen.queryByRole("button", { name: /^Open / })).toBeNull();
  });
});
