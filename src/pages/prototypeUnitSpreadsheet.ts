import ExcelJS from "exceljs";
import type { ProposedUnit } from "./prototypeUnitStructure";
import type { UnitDetails } from "./prototypeUnitDetails";

export type PhysicalGroup = { id: string; name: string; line: string; description?: string; units: ProposedUnit[] };
export const bedroomCount = (d: UnitDetails) => d.bedrooms ?? (d.doubleBedrooms === undefined && d.singleBedrooms === undefined ? undefined : (d.doubleBedrooms ?? 0) + (d.singleBedrooms ?? 0));
export const unitIdentity = (g: PhysicalGroup, u: ProposedUnit) => u.id ?? `${g.id}:unit:${u.number}`;
export type PhysicalChange = { key: string; groupId: string; unitId?: string; name: string; field: keyof UnitDetails | "groupDescription"; before?: string | number; after: string | number; changed: boolean };
export type RowCheck = { key: string; sheet: string; row: number; name: string; reason: string; matchable: boolean };
export type PhysicalReview = { changes: PhysicalChange[]; checks: RowCheck[]; unchanged: number; groups: string[] };
const value = (cell: ExcelJS.Cell): unknown => cell.type === ExcelJS.ValueType.Formula ? cell.value : cell.text === "" ? undefined : cell.value;
const text = (v: unknown) => v === undefined || v === null ? "" : String(v).trim();

export function makePhysicalWorkbook(groups: PhysicalGroup[]) {
  const book = new ExcelJS.Workbook();
  const gs = book.addWorksheet("Unit Groups");
  gs.addRow(["Unit Group name", "Address", "Description", "Record ID"]);
  const us = book.addWorksheet("Units");
  us.addRow(["Unit name", "Unit address", "Type", "Size (m²)", "Bedrooms", "Bathrooms", "Outdoor space", "Shared facilities", "Description", "Record ID", "Unit Group ID"]);
  for (const g of groups) {
    gs.addRow([g.name, g.line, g.description ?? null, g.id]);
    for (const u of g.units) {
      const d = u.details ?? {};
      us.addRow([u.name, g.line, u.classification, d.area === undefined ? null : d.areaUnit === "ft²" ? Math.round(d.area * 0.09290304 * 10000) / 10000 : d.area, u.classification === "Residential" ? bedroomCount(d) ?? null : null, u.classification === "Residential" ? d.bathrooms ?? null : null, u.classification === "Residential" ? d.outsideSpace ?? null : null, u.classification === "Residential" ? d.sharedFacilities ?? null : null, d.description ?? null, unitIdentity(g, u), g.id]);
    }
  }
  gs.getColumn(4).hidden = true; us.getColumn(10).hidden = true; us.getColumn(11).hidden = true;
  for (const sheet of [gs, us]) {
    sheet.views = [{ state: "frozen", ySplit: 1 }];
    sheet.getRow(1).font = { bold: true };
    sheet.columns.forEach((col, i) => { col.width = i === 0 ? 30 : i === 1 || i === 8 || (sheet === gs && i === 2) ? 48 : 20; });
    sheet.eachRow(row => { row.alignment = { vertical: "top", wrapText: true }; });
  }
  us.eachRow((row, n) => {
    if (n === 1) return;
    for (const col of [7, 8]) row.getCell(col).dataValidation = { type: "list", allowBlank: true, formulae: ['"Yes,No"'], showErrorMessage: true, error: "Choose Yes, No or leave blank." };
  });
  return book;
}

export async function downloadPhysicalWorkbook(groups: PhysicalGroup[]) {
  const buffer = await makePhysicalWorkbook(groups).xlsx.writeBuffer();
  const url = URL.createObjectURL(new Blob([new Uint8Array(buffer)], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
  const a = document.createElement("a"); a.href = url; a.download = "Portfolio physical details.xlsx"; a.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function reviewPhysicalWorkbook(book: ExcelJS.Workbook, groups: PhysicalGroup[], matches: Record<string, string> = {}): PhysicalReview {
  const review: PhysicalReview = { changes: [], checks: [], unchanged: 0, groups: [] };
  for (const sheetName of ["Unit Groups", "Units"]) {
    const sheet = book.getWorksheet(sheetName);
    if (!sheet) { review.checks.push({ key: sheetName, sheet: sheetName, row: 0, name: sheetName, reason: "Required sheet missing.", matchable: false }); continue; }
    const expected = sheetName === "Units" ? ["Unit name", "Unit address", "Type", "Size (m²)", "Bedrooms", "Bathrooms", "Outdoor space", "Shared facilities", "Description", "Record ID", "Unit Group ID"] : ["Unit Group name", "Address", "Description", "Record ID"];
    if (expected.some((header, i) => sheet.getRow(1).getCell(i + 1).text !== header)) {
      review.checks.push({ key: sheetName, sheet: sheetName, row: 1, name: sheetName, reason: "Column headings have changed. Please use a fresh downloaded workbook.", matchable: false }); continue;
    }
    const seen = new Set<string>();
    const idColumn = sheetName === "Units" ? 10 : 4;
    const counts = new Map<string, number>();
    sheet.eachRow((row, n) => { if (n === 1) return; const id = matches[`${sheetName}:${n}`] ?? text(value(row.getCell(idColumn))); if (id) counts.set(id, (counts.get(id) ?? 0) + 1); });
    sheet.eachRow((row, n) => {
      if (n === 1) return;
      const key = `${sheetName}:${n}`;
      const id = matches[key] ?? text(value(row.getCell(idColumn)));
      const g = sheetName === "Units" ? groups.find(g => g.units.some(u => unitIdentity(g, u) === id)) : groups.find(g => g.id === id);
      const u = sheetName === "Units" && g ? g.units.find(u => unitIdentity(g, u) === id) : undefined;
      const name = text(value(row.getCell(1))) || `Row ${n}`;
      const issue = (reason: string, matchable = false) => review.checks.push({ key, sheet: sheetName, row: n, name, reason, matchable });
      if (!g || (sheetName === "Units" && !u)) { issue("Choose the existing record this row describes. No new records will be created.", true); return; }
      if (seen.has(id) || (counts.get(id) ?? 0) > 1) { issue("More than one row describes this record. Keep one row and upload again."); return; }
      seen.add(id);
      if (!matches[key] && (name !== (u?.name ?? g.name) || text(value(row.getCell(2))) !== g.line || (u && (text(value(row.getCell(3))) !== u.classification || text(value(row.getCell(11))) !== g.id)))) {
        issue("Reference details differ. Confirm the intended existing record; its name, address and type will stay unchanged.", true); return;
      }
      const candidates: PhysicalChange[] = [];
      let invalid = false;
      const add = (field: PhysicalChange["field"], before: string | number | undefined, after: unknown) => {
        if (after === undefined || after === null || text(after) === "") return;
        if (typeof after !== "string" && typeof after !== "number") { issue("Use plain text or numbers, not formulas or formatted objects."); invalid = true; return; }
        if (before === after || (field === "area" && typeof before === "number" && typeof after === "number" && Math.abs(before - after) < 0.0001)) { review.unchanged++; return; }
        candidates.push({ key: `${key}:${field}`, groupId: g.id, unitId: u ? unitIdentity(g, u) : undefined, name: u?.name ?? g.name, field, before, after, changed: before !== undefined && before !== "" });
      };
      if (!u) add("groupDescription", g.description, value(row.getCell(3)));
      else {
        const d = u.details ?? {};
        for (const [col, field] of [[4, "area"], [5, "bedrooms"], [6, "bathrooms"], [7, "outsideSpace"], [8, "sharedFacilities"], [9, "description"]] as const) {
          const v = value(row.getCell(col));
          if (v === undefined) continue;
          if (u.classification === "Commercial" && [5, 6, 7, 8].includes(col)) { issue("Bedrooms, bathrooms and residential facilities do not apply to this commercial Unit."); invalid = true; continue; }
          if ([4, 5, 6].includes(col)) {
            const number = typeof v === "number" ? v : Number(text(v));
            if (!Number.isFinite(number) || number < 0 || (col !== 4 && !Number.isInteger(number))) { issue(`${sheet.getRow(1).getCell(col).text}: enter a non-negative ${col === 4 ? "number" : "whole number"}, or leave blank.`); invalid = true; continue; }
            const before = field === "bedrooms" ? bedroomCount(d) : field === "area" ? d.area === undefined ? undefined : d.areaUnit === "ft²" ? d.area * 0.09290304 : d.area : d.bathrooms;
            add(field, before, number);
          } else if (col === 7 || col === 8) {
            const normal = text(v).toLowerCase();
            if (!["yes", "no"].includes(normal)) { issue(`${sheet.getRow(1).getCell(col).text}: use Yes, No or blank.`); invalid = true; continue; }
            add(field, d[field], normal === "yes" ? "Yes" : "No");
          } else add(field, d.description, v);
        }
      }
      if (!invalid) { review.changes.push(...candidates); if (!review.groups.includes(g.id)) review.groups.push(g.id); }
    });
  }
  return review;
}

export function applyPhysicalChanges<T extends PhysicalGroup>(groups: T[], changes: PhysicalChange[], approved: string[]): T[] {
  return groups.map(g => {
    const mine = changes.filter(c => c.groupId === g.id && approved.includes(c.key));
    return { ...g, description: mine.find(c => c.field === "groupDescription")?.after as string | undefined ?? g.description, units: g.units.map(u => {
      const edits = mine.filter(c => c.unitId === unitIdentity(g, u));
      if (!edits.length) return u;
      const details = { ...u.details };
      for (const c of edits) {
        (details as Record<string, unknown>)[c.field] = c.after;
        if (c.field === "area") details.areaUnit = "m²";
        if (c.field === "bedrooms") { delete details.doubleBedrooms; delete details.singleBedrooms; }
      }
      return { ...u, details };
    }) };
  });
}