import { describe, expect, it } from "vitest";
import { statusFor, tenancyStatus } from "@/pages/prototypeUnitTenancy";

describe("Unit tenancy status", () => {
  it("shows the four simulated Stanley House statuses with exact wording", () => {
    expect([1, 2, 3, 4].map(n => statusFor("stanley-finchley", n))).toEqual(["Current tenancy recorded", "Previous tenancies only", "Tenancy status unconfirmed", "No tenancy recorded"]);
  });
  it("current wins; all ended means previous; any unresolved without current is unconfirmed", () => {
    expect(tenancyStatus([{ position: "ended", relationshipConfirmed: true }, { position: "current", relationshipConfirmed: true }])).toBe("Current tenancy recorded");
    expect(tenancyStatus([{ position: "ended", relationshipConfirmed: true }, { position: "unresolved", relationshipConfirmed: true }])).toBe("Tenancy status unconfirmed");
  });
  it("ignores unconfirmed relationships and gives other Units no tenancy", () => {
    expect(tenancyStatus([{ position: "current", relationshipConfirmed: false }])).toBe("No tenancy recorded");
    expect(statusFor("stanley-finchley", 7)).toBe("No tenancy recorded");
    expect(statusFor("some-other-place", 1)).toBe("No tenancy recorded");
  });
});
