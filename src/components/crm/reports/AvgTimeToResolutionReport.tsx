import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ReportCard } from "./ReportCard";
import { useAvgTimeToResolution } from "@/hooks/crm/reports/useServiceReports";
import { downloadCsv } from "@/lib/crm/reportsExport";

const PRIORITY_COLOR: Record<string, string> = {
  low: "#94a3b8",
  medium: "#3b82f6",
  high: "#f59e0b",
  urgent: "#f43f5e",
};

export const AvgTimeToResolutionReport = () => {
  const { data, isLoading } = useAvgTimeToResolution();
  const rows = data ?? [];
  const total = rows.reduce((a, r) => a + r.count, 0);

  return (
    <ReportCard
      title="Avg time to resolution"
      description="Mean days from issue created → resolved, by priority."
      isLoading={isLoading}
      isEmpty={total === 0}
      onExport={() =>
        downloadCsv(
          "avg-time-to-resolution",
          ["Priority", "Avg days", "Issues resolved"],
          rows.map((r) => [r.label, r.avg_days, r.count]),
        )
      }
      footer={<span>{total} issues resolved in this range.</span>}
    >
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={rows} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
          <XAxis dataKey="label" tick={{ fontSize: 11 }} />
          <YAxis
            tick={{ fontSize: 11 }}
            tickFormatter={(v) => `${v}d`}
          />
          <Tooltip
            formatter={(v: number) => [`${v} days`, "Avg resolution"]}
          />
          <Bar dataKey="avg_days" radius={[4, 4, 0, 0]}>
            {rows.map((r) => (
              <Cell key={r.priority} fill={PRIORITY_COLOR[r.priority]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ReportCard>
  );
};
