import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ReportCard } from "./ReportCard";
import { useInboundOutboundRatio } from "@/hooks/crm/reports/useActivityReports";
import { downloadCsv } from "@/lib/crm/reportsExport";

export const InboundOutboundReport = () => {
  const { data, isLoading } = useInboundOutboundRatio();
  const points = data ?? [];
  const total = points.reduce(
    (a, p) => a + p.inbound + p.outbound + p.internal,
    0,
  );

  return (
    <ReportCard
      title="Inbound vs outbound"
      description="Direction of communications per period."
      isLoading={isLoading}
      isEmpty={total === 0}
      onExport={() =>
        downloadCsv(
          "inbound-vs-outbound",
          ["Period", "Inbound", "Outbound", "Internal"],
          points.map((p) => [p.label, p.inbound, p.outbound, p.internal]),
        )
      }
    >
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={points} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
          <XAxis dataKey="label" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="inbound" name="Inbound" fill="#3b82f6" />
          <Bar dataKey="outbound" name="Outbound" fill="#10b981" />
          <Bar dataKey="internal" name="Internal" fill="#94a3b8" />
        </BarChart>
      </ResponsiveContainer>
    </ReportCard>
  );
};
