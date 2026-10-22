import { describe, expect, it } from "vitest";
import { routeRequest } from "@/pages/PrototypeBackOffice";

describe("back office routing", () => {
  it.each([
    ["I want to add a lease.", "professor"],
    ["Add a new Unit at 10 Baker Street.", "architect"],
    ["Add John Smith as my preferred electrician for Burlington Gardens.", "broker"],
    ["Give Sarah access to Stanley House but only to the compliance papers.", "keeper"],
    ["What compliance responsibilities do I have for Stanley House?", "inspector"],
    ["Now add the managing agent's contact details.", "broker"],
  ])("%s → %s", (text, who) => expect(routeRequest(text)).toBe(who));
  it("asks when unclear", () => expect(routeRequest("hello")).toBeNull());
});
