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
import { useStaleClientsTrend } from "@/hooks/crm/reports/useActivityReports";
import { downloadCsv } from "@/lib/crm/reportsExport";

export const StaleClientsTrendReport = () => {
  const { data, isLoading } = useStaleClientsTrend();
  const points = data ?? [];
  const max = points.reduce((a, p) => Math.max(a, p.stale_count), 0);

  return (
    <ReportCard
      title="Stale clients trend"
      description="Active clients with no activity for 30+ days at the end of each period."
      isLoading={isLoading}
      isEmpty={max === 0}
      onExport={() =>
        downloadCsv(
          "stale-clients-trend",
          ["Period end", "Stale clients"],
          points.map((p) => [p.label, p.stale_count]),
        )
      }
    >
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={points} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="stale_count"
            name="Stale clients"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ReportCard>
  );
};
