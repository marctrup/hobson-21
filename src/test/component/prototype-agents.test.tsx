import { useState } from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { describe, expect, it, vi } from "vitest";
import PrototypeAgents from "@/pages/PrototypeAgents";
import type { StatusExtension, StatusExtensionContext } from "@/pages/PrototypeStatus";

// Isolate responsibility behaviour; the unchanged real Map/Papers shell has its own suite.
vi.mock("@/pages/PrototypeStatus", () => ({ default: ({ extension }: { extension: StatusExtension }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ text: string; choices?: string[] }[]>([]);
  const context: StatusExtensionContext = { reply: (text, choices) => setMessages((previous) => [...previous, { text, choices }]), fillInput: setInput, open: () => {} };
  const send = (text: string) => { extension.onMessage(text, context); setInput(""); };
  return <><input aria-label="Ask Hobson" value={input} onChange={(e) => setInput(e.target.value)} /><button onClick={() => send(input)}>Send message</button><div aria-label="Replies">{messages.map((message, i) => <div key={i}><p>{message.text}</p>{i === messages.length - 1 && message.choices?.map((choice) => <button key={choice} onClick={() => send(choice)}>{choice}</button>)}</div>)}</div>{extension.render(context)}</>;
} }));

const start = () => render(<HelmetProvider><PrototypeAgents /></HelmetProvider>);
const ask = (text: string) => {
  fireEvent.change(screen.getByRole("textbox", { name: "Ask Hobson" }), { target: { value: text } });
  fireEvent.click(screen.getByRole("button", { name: "Send message" }));
};
const openCompliance = () => {
  fireEvent.click(screen.getByRole("button", { name: "Compliance11" }));
  fireEvent.click(screen.getByRole("button", { name: /^Compliance Management/ }));
};
const tab = (name: string) => fireEvent.mouseDown(screen.getByRole("tab", { name }), { button: 0, ctrlKey: false });

describe("Agents conversation and workspace", () => {
  it("commissions the six-month £25 Monday break report only after confirmation", () => {
    start();
    ask("Every Monday, review all my break notice deadlines within the next six months and email me a summary.");
    fireEvent.click(screen.getByRole("button", { name: "Yes, include both" }));
    expect(screen.queryByRole("heading", { name: "Weekly Break Report" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Proposed responsibility" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Confirm responsibility" }));
    expect(screen.queryByRole("region", { name: "Proposed responsibility" })).toBeNull();
    tab("How it works");
    expect(screen.getByText("Are notice deadlines due within the next 6 months?")).toBeInTheDocument();
    tab("Overview");
    expect(screen.getByText("£25.00")).toBeInTheDocument();
    expect(screen.getByText("Every Monday at 09:00")).toBeInTheDocument();
  });
  it("keeps an instruction proposal separate, then updates the confirmed 60-day workflow", () => {
    start(); openCompliance();
    ask("Contact contractors 60 days before expiry instead of 30.");
    tab("How it works");
    expect(screen.getByText("Are any inspections due within 30 days?")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Confirm change" }));
    expect(screen.getByText("Are any inspections due within 60 days?")).toBeInTheDocument();
    tab("Activity");
    fireEvent.click(screen.getByRole("button", { name: "Instruction changed" }));
    expect(screen.getByText(/changed from 30 to 60 days/)).toBeInTheDocument();
  });
  it("records pause and resume without changing subscription or outstanding work", () => {
    start(); openCompliance();
    fireEvent.click(screen.getByRole("button", { name: /^Pause$/ }));
    fireEvent.click(screen.getByRole("button", { name: "Confirm pause" }));
    expect(screen.getByText("£75.00")).toBeInTheDocument();
    expect(screen.getByText("Paused — no scheduled review")).toBeInTheDocument();
    expect(screen.getByText("Six inspections requiring attention.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /^Resume$/ }));
    fireEvent.click(screen.getByRole("button", { name: "Confirm resume" }));
    expect(screen.getByText("1 December at 09:00")).toBeInTheDocument();
  });
  it("cannot materially change a view-and-instruct shared responsibility through chat", () => {
    start();
    tab("Shared with me22");
    fireEvent.click(screen.getByRole("button", { name: "Renewals11" }));
    fireEvent.click(screen.getByRole("button", { name: /^Tenancy Renewal Management/ }));
    ask("Pause this agent");
    expect(screen.queryByRole("button", { name: "Confirm pause" })).toBeNull();
    expect(screen.getByText(/must authorise changes to its scope/)).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
  });
  it("records an overlap access request without revealing another agent or granting access", () => {
    start(); ask("Look after gas safety compliance across Russell Square House.");
    fireEvent.click(screen.getByRole("button", { name: "Request access" }));
    expect(screen.getByText(/No access has been granted/)).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Gas Safety Compliance" })).toBeNull();
  });
  it("preserves authority when moving from a job to its originating responsibility", () => {
    start(); openCompliance();
    fireEvent.click(screen.getByRole("button", { name: /^See what I’m up to$/ }));
    fireEvent.click(screen.getByRole("button", { name: "Approve an electrical inspection quotation of £180" }));
    fireEvent.click(screen.getByRole("button", { name: "Confirm £180 approval" }));
    expect(screen.getByRole("button", { name: "Electrical inspection quotation approved — not yet instructed" })).toBeInTheDocument();
    const work = screen.getByRole("region", { name: "Delegated responsibilities" });
    fireEvent.click(within(work).getAllByRole("button", { name: /^Compliance Management$/ })[0]);
    expect(screen.getByRole("heading", { name: "Compliance Management" })).toBeInTheDocument();
    expect(screen.getByText("Committing expenditure")).toBeInTheDocument();
  });
  it("changes a proposed report to shared and twelve months before confirming", () => {
    start(); ask("Every Monday review my break notice deadlines.");
    fireEvent.click(screen.getByRole("button", { name: "Yes, include both" }));
    ask("Share with my team, next 12 months");
    fireEvent.click(screen.getByRole("button", { name: "Confirm responsibility" }));
    expect(screen.getByText("Next 12 months")).toBeInTheDocument();
    expect(screen.getAllByText("Full management")).toHaveLength(2);
    expect(screen.getByText("Shared with the Property Management Team")).toBeInTheDocument();
  });
});