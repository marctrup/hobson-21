// CSV export utility for Reports.
// Filenames follow `report-slug_YYYY-MM-DD.csv` so they're easy to find.

const escapeCell = (v: unknown): string => {
  if (v === null || v === undefined) return "";
  const s = typeof v === "string" ? v : String(v);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
};

export const toCsv = (
  headers: string[],
  rows: Array<Array<string | number | null | undefined>>,
): string => {
  const lines = [headers.map(escapeCell).join(",")];
  for (const r of rows) lines.push(r.map(escapeCell).join(","));
  return lines.join("\n");
};

export const downloadCsv = (
  reportSlug: string,
  headers: string[],
  rows: Array<Array<string | number | null | undefined>>,
): void => {
  const csv = toCsv(headers, rows);
  const today = new Date().toISOString().slice(0, 10);
  const fileName = `${reportSlug}_${today}.csv`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
