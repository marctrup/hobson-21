import { describe, expect, it } from "vitest";
import { voiceAs } from "@/pages/PrototypeBackOffice";
import owlDefault from "@/assets/prototype/owl-default.png";

const SAMPLE =
  '<h1>Chat with Hobson</h1>' +
  '<section aria-label="Chat with Hobson"><button title="Chat with Hobson"></button></section>' +
  '<h1>People with access</h1>' +
  '<p>Chat with Hobson is also mentioned in body copy.</p>' +
  `<img src="${owlDefault}" alt="Hobson" />`;

function host() {
  const el = document.createElement("div");
  el.innerHTML = SAMPLE;
  return el;
}

describe("colleague voice inside a colleague's work", () => {
  it("renames the chat heading to that colleague", () => {
    const el = host();
    voiceAs(el, "architect.png", "The Architect");
    expect(el.querySelectorAll("h1")[0].textContent).toBe("Chat with the Architect");
  });

  it("renames the matching aria-label and title, leaving other text alone", () => {
    const el = host();
    voiceAs(el, "professor.png", "The Professor");
    expect(el.querySelector("section")?.getAttribute("aria-label")).toBe("Chat with the Professor");
    expect(el.querySelector("button")?.getAttribute("title")).toBe("Chat with the Professor");
    expect(el.querySelectorAll("h1")[1].textContent).toBe("People with access");
    expect(el.querySelector("p")?.textContent).toBe("Chat with Hobson is also mentioned in body copy.");
  });

  it("swaps Hobson's owl for the colleague's and is safe to apply twice", () => {
    const el = host();
    voiceAs(el, "keeper.png", "The Keeper");
    voiceAs(el, "keeper.png", "The Keeper");
    const img = el.querySelector("img");
    expect(img?.getAttribute("src")).toBe("keeper.png");
    expect(img?.getAttribute("alt")).toBe("The Keeper");
    expect(el.querySelectorAll("h1")[0].textContent).toBe("Chat with the Keeper");
  });

  it("adds one introduction before a lazily mounted conversation and preserves its existing turns", async () => {
    const el = host();
    voiceAs(el, "professor.png", "The Professor", "An introduction");
    const log = document.createElement("div");
    log.setAttribute("role", "log");
    log.setAttribute("aria-label", "Conversation");
    const original = document.createElement("div");
    log.append(original);
    el.append(log);
    await new Promise((resolve) => setTimeout(resolve, 0));
    const introduction = log.querySelector('[data-colleague-introduction="true"]');
    expect(introduction).not.toBeNull();
    expect(log.firstElementChild).toBe(introduction);
    expect(log.lastElementChild).toBe(original);
    voiceAs(el, "professor.png", "The Professor", "An introduction");
    const followup = document.createElement("div");
    log.append(followup);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(log.querySelectorAll('[data-colleague-introduction="true"]')).toHaveLength(1);
    expect(log.lastElementChild).toBe(followup);
  });
});
