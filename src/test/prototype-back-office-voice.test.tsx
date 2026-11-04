import { describe, expect, it } from "vitest";
import { hobsonFronts } from "@/pages/PrototypeBackOffice";
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

describe("Hobson's voice inside a colleague's work", () => {
  it("keeps the chat heading as Hobson's", () => {
    const el = host();
    hobsonFronts(el, "My colleague the Architect has the map ready.");
    expect(el.querySelectorAll("h1")[0].textContent).toBe("Chat with Hobson");
  });

  it("leaves every label, title and owl as Hobson's", () => {
    const el = host();
    hobsonFronts(el, "My colleague the Professor will take a look.");
    expect(el.querySelector("section")?.getAttribute("aria-label")).toBe("Chat with Hobson");
    expect(el.querySelector("button")?.getAttribute("title")).toBe("Chat with Hobson");
    expect(el.querySelectorAll("h1")[1].textContent).toBe("People with access");
    const img = el.querySelector("img");
    expect(img?.getAttribute("src")).toBe(owlDefault);
    expect(img?.getAttribute("alt")).toBe("Hobson");
  });

  it("opens the conversation with Hobson's handover, spoken with his owl", async () => {
    const el = host();
    hobsonFronts(el, "My colleague the Professor will take a look.");
    const log = document.createElement("div");
    log.setAttribute("role", "log");
    log.setAttribute("aria-label", "Conversation");
    const original = document.createElement("div");
    log.append(original);
    el.append(log);
    await new Promise((resolve) => setTimeout(resolve, 0));
    const handover = log.querySelector('[data-hobson-handover="true"]');
    expect(handover).not.toBeNull();
    expect(log.firstElementChild).toBe(handover);
    expect(handover?.textContent).toContain("My colleague the Professor will take a look.");
    expect(handover?.querySelector("img")?.getAttribute("src")).toBe(owlDefault);
    expect(handover?.querySelector("img")?.getAttribute("alt")).toBe("Hobson");
    expect(log.lastElementChild).toBe(original);
  });

  it("is safe to apply twice and preserves later turns", async () => {
    const el = host();
    hobsonFronts(el, "Here is who has access.");
    hobsonFronts(el, "Here is who has access.");
    const log = document.createElement("div");
    log.setAttribute("role", "log");
    log.setAttribute("aria-label", "Conversation");
    el.append(log);
    await new Promise((resolve) => setTimeout(resolve, 0));
    const followup = document.createElement("div");
    log.append(followup);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(log.querySelectorAll('[data-hobson-handover="true"]')).toHaveLength(1);
    expect(log.lastElementChild).toBe(followup);
  });
});
