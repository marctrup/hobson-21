import { createContext, ReactNode, useContext, useMemo, useState } from "react";

export type DateRangePreset =
  | "4w"
  | "12w"
  | "6m"
  | "12m"
  | "ytd"
  | "custom";

export interface ReportsFiltersValue {
  preset: DateRangePreset;
  setPreset: (p: DateRangePreset) => void;
  startDate: Date;
  endDate: Date;
  setCustomRange: (start: Date, end: Date) => void;
  ownerId: string | "all";
  setOwnerId: (id: string | "all") => void;
  /** Recommended bucket size for time-series charts. */
  bucket: "day" | "week" | "month";
  /** ISO bucket boundaries covering [startDate, endDate]. */
  buckets: { start: Date; end: Date; label: string }[];
}

const ReportsFiltersContext = createContext<ReportsFiltersValue | null>(null);

const startOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};
const startOfWeek = (d: Date) => {
  // Monday as the start of the week (UK convention).
  const x = startOfDay(d);
  const day = (x.getDay() + 6) % 7;
  x.setDate(x.getDate() - day);
  return x;
};
const startOfMonth = (d: Date) => {
  const x = startOfDay(d);
  x.setDate(1);
  return x;
};

const presetToRange = (preset: DateRangePreset): { start: Date; end: Date } => {
  const end = startOfDay(new Date());
  end.setDate(end.getDate() + 1); // exclusive
  const start = new Date(end);
  switch (preset) {
    case "4w":
      start.setDate(end.getDate() - 28);
      break;
    case "12w":
      start.setDate(end.getDate() - 84);
      break;
    case "6m":
      start.setMonth(end.getMonth() - 6);
      break;
    case "12m":
      start.setFullYear(end.getFullYear() - 1);
      break;
    case "ytd":
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      break;
    default:
      start.setDate(end.getDate() - 84);
  }
  return { start, end };
};

const computeBuckets = (
  start: Date,
  end: Date,
): { bucket: "day" | "week" | "month"; buckets: ReportsFiltersValue["buckets"] } => {
  const ms = end.getTime() - start.getTime();
  const days = ms / (24 * 60 * 60 * 1000);
  let bucket: "day" | "week" | "month" = "week";
  if (days <= 28) bucket = "day";
  else if (days <= 184) bucket = "week";
  else bucket = "month";

  const buckets: ReportsFiltersValue["buckets"] = [];
  let cursor =
    bucket === "day"
      ? startOfDay(start)
      : bucket === "week"
        ? startOfWeek(start)
        : startOfMonth(start);

  while (cursor < end) {
    const next = new Date(cursor);
    if (bucket === "day") next.setDate(next.getDate() + 1);
    else if (bucket === "week") next.setDate(next.getDate() + 7);
    else next.setMonth(next.getMonth() + 1);
    const label =
      bucket === "month"
        ? cursor.toLocaleDateString("en-GB", { month: "short", year: "2-digit" })
        : cursor.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
    buckets.push({ start: new Date(cursor), end: new Date(next), label });
    cursor = next;
  }
  return { bucket, buckets };
};

export const ReportsFiltersProvider = ({ children }: { children: ReactNode }) => {
  const [preset, setPreset] = useState<DateRangePreset>("12w");
  const [customStart, setCustomStart] = useState<Date | null>(null);
  const [customEnd, setCustomEnd] = useState<Date | null>(null);
  const [ownerId, setOwnerId] = useState<string | "all">("all");

  const { start, end } = useMemo(() => {
    if (preset === "custom" && customStart && customEnd) {
      const e = startOfDay(customEnd);
      e.setDate(e.getDate() + 1);
      return { start: startOfDay(customStart), end: e };
    }
    return presetToRange(preset);
  }, [preset, customStart, customEnd]);

  const { bucket, buckets } = useMemo(() => computeBuckets(start, end), [start, end]);

  const value: ReportsFiltersValue = {
    preset,
    setPreset,
    startDate: start,
    endDate: end,
    setCustomRange: (s, e) => {
      setCustomStart(s);
      setCustomEnd(e);
      setPreset("custom");
    },
    ownerId,
    setOwnerId,
    bucket,
    buckets,
  };

  return (
    <ReportsFiltersContext.Provider value={value}>
      {children}
    </ReportsFiltersContext.Provider>
  );
};

export const useReportsFilters = (): ReportsFiltersValue => {
  const ctx = useContext(ReportsFiltersContext);
  if (!ctx) throw new Error("useReportsFilters must be used within ReportsFiltersProvider");
  return ctx;
};

export const PRESET_LABELS: Record<DateRangePreset, string> = {
  "4w": "Last 4 weeks",
  "12w": "Last 12 weeks",
  "6m": "Last 6 months",
  "12m": "Last 12 months",
  ytd: "Year to date",
  custom: "Custom",
};
