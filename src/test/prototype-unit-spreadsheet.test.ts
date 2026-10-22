import { describe, expect, it } from "vitest";
import { applyPhysicalChanges, makePhysicalWorkbook, reviewPhysicalWorkbook, type PhysicalGroup } from "@/pages/prototypeUnitSpreadsheet";

const groups = (): PhysicalGroup[] => [{ id: "paragon", name: "The Paragon Centre", line: "3 Reading Lane, London E8 1GQ", units: [{ id: "gym", number: 1, name: "First Floor Gym", type: "Unit", classification: "Commercial", details: { area: 210, areaUnit: "m²" } }, { id: "flat", number: 2, name: "Second Floor Flat", type: "Flat", classification: "Residential", details: { doubleBedrooms: 1, bathrooms: 1, outsideSpace: "No" }, photos: [{ id: "photo", name: "Photo", url: "photo.jpg" }] }] }];
describe("Optional physical details workbook", () => {
  it("uses current records, stable hidden identifiers and actual bedroom counts", async () => {
    const g = groups(); g[0].units[1].details = { bedrooms: 3 };
    const b = makePhysicalWorkbook(g); const u = b.getWorksheet("Units");
    expect(u?.getCell("E3").value).toBe(3); expect(u?.getCell("J3").value).toBe("flat"); expect(u?.getColumn(10).hidden).toBe(true);
    expect((await b.xlsx.writeBuffer()).byteLength).toBeGreaterThan(1000);
  });
  it("preserves existing fields and photographs when blank cells are returned", () => {
    const g = groups(), b = makePhysicalWorkbook(g); const sheet = b.getWorksheet("Units"); if (!sheet) throw Error(); sheet.getCell("F3").value = null;
    const r = reviewPhysicalWorkbook(b, g); expect(r.changes).toHaveLength(0);
    expect(applyPhysicalChanges(g, r.changes, [])[0].units[1]).toEqual(g[0].units[1]);
  });
  it("replaces one bedroom with two only after approval without inventing bedroom types", () => {
    const g = groups(), b = makePhysicalWorkbook(g); const sheet = b.getWorksheet("Units"); if (!sheet) throw Error(); sheet.getCell("E3").value = 2;
    const r = reviewPhysicalWorkbook(b, g); expect(r.changes[0]).toMatchObject({ before: 1, after: 2, changed: true });
    expect(applyPhysicalChanges(g, r.changes, [])[0].units[1].details?.doubleBedrooms).toBe(1);
    const saved = applyPhysicalChanges(g, r.changes, r.changes.map(c => c.key));
    expect(saved[0].units[1].details).toEqual({ bedrooms: 2, bathrooms: 1, outsideSpace: "No" });
    expect(makePhysicalWorkbook(saved).getWorksheet("Units")?.getCell("E3").value).toBe(2);
  });
  it("never silently changes structural references and allows explicit matching", () => {
    const g = groups(), b = makePhysicalWorkbook(g); const s = b.getWorksheet("Units"); if (!s) throw Error(); s.getCell("A3").value = "Renamed Flat"; s.getCell("E3").value = 2;
    const r = reviewPhysicalWorkbook(b, g); expect(r.checks).toHaveLength(1); expect(r.changes).toHaveLength(0);
    const matched = reviewPhysicalWorkbook(b, g, { "Units:3": "flat" });
    expect(applyPhysicalChanges(g, matched.changes, matched.changes.map(c => c.key))[0].units[1].name).toBe("Second Floor Flat");
  });
  it("rejects invalid and residential-only commercial values", () => {
    const g = groups(), b = makePhysicalWorkbook(g); const s = b.getWorksheet("Units"); if (!s) throw Error(); s.getCell("E2").value = 2; s.getCell("G3").value = "Perhaps";
    const r = reviewPhysicalWorkbook(b, g); expect(r.checks).toHaveLength(2); expect(r.changes).toHaveLength(0);
  });
  it("does not guess unmatched identities or accept duplicate rows", () => {
    const g = groups(), b = makePhysicalWorkbook(g); const s = b.getWorksheet("Units"); if (!s) throw Error(); s.getCell("J3").value = "unknown";
    expect(reviewPhysicalWorkbook(b, g).checks[0].matchable).toBe(true);
    s.getCell("J3").value = "flat"; s.addRow(s.getRow(3).values); s.getCell("E3").value = 2;
    const r = reviewPhysicalWorkbook(b, g); expect(r.checks).toHaveLength(2); expect(r.changes).toHaveLength(0);
  });
});