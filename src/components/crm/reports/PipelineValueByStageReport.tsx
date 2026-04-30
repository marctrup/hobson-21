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
import { usePipelineValueByStage } from "@/hooks/crm/reports/usePipelineReports";
import { downloadCsv } from "@/lib/crm/reportsExport";
import { formatGBP } from "@/lib/crm/labels";

const COLOR_HEX: Record<string, string> = {
  muted: "#94a3b8",
  secondary: "#3b82f6",
  accent: "#a855f7",
  primary: "#f59e0b",
  success: "#10b981",
  destructive: "#f43f5e",
};

export const PipelineValueByStageReport = () => {
  const { data, isLoading } = usePipelineValueByStage();
  const rows = data ?? [];
  const total = rows.reduce((a, r) => a + r.weighted_value, 0);

  return (
    <ReportCard
      title="Pipeline value by stage"
      description="Where weighted deal value is concentrated across active stages."
      isLoading={isLoading}
      isEmpty={total === 0}
      onExport={() =>
        downloadCsv(
          "pipeline-value-by-stage",
          ["Stage", "Weighted value (GBP)", "Clients"],
          rows.map((r) => [r.label, r.weighted_value, r.count]),
        )
      }
      footer={<span>Total weighted: {formatGBP(total)}</span>}
    >
      <ResponsiveContainer width="100%" height={240}>
        <BarChart
          data={rows}
          margin={{ top: 8, right: 12, left: 0, bottom: 4 }}
        >
          <XAxis dataKey="label" tick={{ fontSize: 11 }} />
          <YAxis
            tick={{ fontSize: 11 }}
            tickFormatter={(v) => (v >= 1000 ? `£${Math.round(v / 1000)}k` : `£${v}`)}
          />
          <Tooltip formatter={(v: number) => [formatGBP(v), "Weighted value"]} />
          <Bar dataKey="weighted_value" radius={[4, 4, 0, 0]}>
            {rows.map((r) => (
              <Cell key={r.key} fill={COLOR_HEX[r.color] ?? COLOR_HEX.muted} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ReportCard>
  );
};
