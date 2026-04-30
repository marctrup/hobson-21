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
import { useNewEnquiriesOverTime } from "@/hooks/crm/reports/useLeadReports";
import { downloadCsv } from "@/lib/crm/reportsExport";

const PALETTE = ["#3b82f6", "#10b981", "#f59e0b", "#a855f7", "#f43f5e", "#64748b"];

export const NewEnquiriesReport = () => {
  const { data, isLoading } = useNewEnquiriesOverTime();
  const points = data?.points ?? [];
  const sources = data?.sources ?? [];
  const total = points.reduce(
    (a, p) =>
      a +
      sources.reduce((sa, s) => sa + (Number(p[s.key]) || 0), 0),
    0,
  );

  return (
    <ReportCard
      title="New enquiries over time"
      description="New clients created per period, split by acquisition source."
      isLoading={isLoading}
      isEmpty={total === 0}
      onExport={() =>
        downloadCsv(
          "new-enquiries",
          ["Period", ...sources.map((s) => s.label)],
          points.map((p) => [
            String(p.label),
            ...sources.map((s) => Number(p[s.key]) || 0),
          ]),
        )
      }
      footer={<span>{total} new enquiries in this range.</span>}
    >
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={points} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
          <XAxis dataKey="label" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {sources.map((s, i) => (
            <Bar
              key={s.key}
              dataKey={s.key}
              name={s.label}
              stackId="a"
              fill={PALETTE[i % PALETTE.length]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ReportCard>
  );
};
