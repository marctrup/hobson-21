import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { ReportCard } from "./ReportCard";
import { usePipelineValueOverTime } from "@/hooks/crm/reports/usePipelineReports";
import { downloadCsv } from "@/lib/crm/reportsExport";
import { formatGBP } from "@/lib/crm/labels";

export const PipelineValueOverTimeReport = () => {
  const { data, isLoading } = usePipelineValueOverTime();
  const points = data ?? [];
  const total = points.reduce((a, p) => a + p.weighted_value, 0);

  return (
    <ReportCard
      title="Pipeline value over time"
      description="Weighted value (deal × probability) of new clients per period."
      isLoading={isLoading}
      isEmpty={total === 0}
      onExport={() =>
        downloadCsv(
          "pipeline-value-over-time",
          ["Period", "Weighted value (GBP)"],
          points.map((p) => [p.label, p.weighted_value]),
        )
      }
    >
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={points} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} />
          <YAxis
            tick={{ fontSize: 11 }}
            tickFormatter={(v) => (v >= 1000 ? `£${Math.round(v / 1000)}k` : `£${v}`)}
          />
          <Tooltip formatter={(v: number) => [formatGBP(v), "Weighted value"]} />
          <Line
            type="monotone"
            dataKey="weighted_value"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ReportCard>
  );
};
