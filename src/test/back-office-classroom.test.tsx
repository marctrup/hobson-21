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

it("inspecting a colleague does not open their work", () => {
  const onOpen = vi.fn();
  render(<BackOfficeClassroom onOpen={onOpen} />);
  fireEvent.mouseEnter(screen.getByRole("button", { name: "Contacts" }));
  fireEvent.focus(screen.getByRole("button", { name: "Papers" }));
  expect(onOpen).not.toHaveBeenCalled();
});

const ROSTER = [
  { id: "keeper", contribution: "I keep watch over who may see and change what." },
  { id: "broker", contribution: "I maintain the people and organisations connected to your portfolio." },
  { id: "inspector", contribution: "I compare what is known against what is required." },
  { id: "professor", contribution: "I maintain everything Hobson knows from your documents." },
  { id: "architect", contribution: "I keep the structure of your estate accurate." },
];

it("Hobson presents his specialist assistance and invites hover or click for details", () => {
  const onOpen = vi.fn();
  render(<BackOfficeClassroom onOpen={onOpen} introductions={ROSTER} />);
  fireEvent.mouseEnter(screen.getByRole("button", { name: "Hobson" }));
  const board = screen.getByRole("tooltip").querySelector(".sr-only")?.textContent ?? "";
  expect(board).toMatch(/May I present my colleagues/i);
  expect(board).toMatch(/the Professor, the Architect, the Broker, the Keeper and the Inspector/);
  expect(board).toMatch(/Hover over any of them, or click, for more details/i);
  expect(onOpen).not.toHaveBeenCalled();
});

it("clicking Hobson shows each colleague in detail without starting their work", () => {
  const onOpen = vi.fn();
  render(<BackOfficeClassroom onOpen={onOpen} introductions={ROSTER} />);
  fireEvent.click(screen.getByRole("button", { name: "Hobson" }));
  const roster = screen.getByRole("region", { name: "Hobson's colleagues" });
  expect(roster).toHaveTextContent("Each keeps a particular part of your portfolio in order");
  for (const [name, area] of [["The Keeper", "Permissions"], ["The Broker", "Contacts"], ["The Inspector", "Compliance"], ["The Professor", "Papers"], ["The Architect", "Units"]]) {
    expect(roster).toHaveTextContent(name);
    expect(roster).toHaveTextContent(area);
  }
  expect(onOpen).not.toHaveBeenCalled();
  fireEvent.click(within(roster).getByRole("button", { name: /^The Professor/ }));
  expect(onOpen).toHaveBeenLastCalledWith("professor");
  expect(screen.queryByRole("region", { name: "Hobson's colleagues" })).toBeNull();
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
  const onOpen = vi.fn();
  const board = () => document.querySelector(".compact-board .sr-only")?.textContent ?? "";
  inStaffRoom(() => {
    render(<BackOfficeClassroom onOpen={onOpen} introductions={ROSTER} />);
    expect(screen.getByText(/Please scroll/i)).toBeInTheDocument();
    expect(board()).toMatch(/^Hobson\./);
    fireEvent.mouseEnter(screen.getByRole("button", { name: "Papers" }));
    expect(board()).toMatch(/^The Professor\. I maintain everything Hobson knows from your documents/);
    expect(onOpen).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Papers" }));
    expect(screen.getByRole("button", { name: "Open papers" })).toBeInTheDocument();
  });
});
