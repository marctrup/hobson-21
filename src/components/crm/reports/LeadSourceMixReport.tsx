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
import { useLeadSourceMix } from "@/hooks/crm/reports/useLeadReports";
import { downloadCsv } from "@/lib/crm/reportsExport";

const PALETTE = ["#3b82f6", "#10b981", "#f59e0b", "#a855f7", "#f43f5e", "#64748b", "#0ea5e9", "#22c55e"];

export const LeadSourceMixReport = () => {
  const { data, isLoading } = useLeadSourceMix();
  const rows = data ?? [];

  return (
    <ReportCard
      title="Lead source mix"
      description="Where new clients in this range came from."
      isLoading={isLoading}
      isEmpty={rows.length === 0}
      onExport={() =>
        downloadCsv(
          "lead-source-mix",
          ["Source", "Count"],
          rows.map((r) => [r.label, r.count]),
        )
      }
    >
      <ResponsiveContainer width="100%" height={240}>
        <BarChart
          data={rows}
          layout="vertical"
          margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
        >
          <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
          <YAxis
            type="category"
            dataKey="label"
            tick={{ fontSize: 11 }}
            width={140}
          />
          <Tooltip formatter={(v: number) => [`${v}`, "Count"]} />
          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
            {rows.map((r, i) => (
              <Cell key={r.key} fill={PALETTE[i % PALETTE.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ReportCard>
  );
};
