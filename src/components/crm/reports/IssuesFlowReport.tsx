import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { ReportCard } from "./ReportCard";
import { useIssuesOpenedVsResolved } from "@/hooks/crm/reports/useServiceReports";
import { downloadCsv } from "@/lib/crm/reportsExport";

export const IssuesFlowReport = () => {
  const { data, isLoading } = useIssuesOpenedVsResolved();
  const points = data ?? [];
  const total = points.reduce((a, p) => a + p.opened + p.resolved, 0);

  return (
    <ReportCard
      title="Issues opened vs resolved"
      description="Throughput of issue creation versus resolution."
      isLoading={isLoading}
      isEmpty={total === 0}
      onExport={() =>
        downloadCsv(
          "issues-opened-resolved",
          ["Period", "Opened", "Resolved"],
          points.map((p) => [p.label, p.opened, p.resolved]),
        )
      }
    >
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={points} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line
            type="monotone"
            dataKey="opened"
            name="Opened"
            stroke="#f43f5e"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="resolved"
            name="Resolved"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ReportCard>
  );
};
