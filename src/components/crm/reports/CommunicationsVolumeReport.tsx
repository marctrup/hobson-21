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
import { useCommunicationsVolume } from "@/hooks/crm/reports/useActivityReports";
import { downloadCsv } from "@/lib/crm/reportsExport";

const CHANNEL_COLOR: Record<string, string> = {
  email: "#56514A",
  call: "#5E6B33",
  meeting: "#8A8478",
  video_call: "#8b5cf6",
  sms: "#8F5A14",
  whatsapp: "#5E6B33",
  linkedin_message: "#56514A",
  letter: "#56514A",
  other: "#8A8478",
};

export const CommunicationsVolumeReport = () => {
  const { data, isLoading } = useCommunicationsVolume();
  const points = data?.points ?? [];
  const channels = data?.channels ?? [];
  const total = points.reduce(
    (a, p) => a + channels.reduce((s, c) => s + (Number(p[c.key]) || 0), 0),
    0,
  );

  return (
    <ReportCard
      title="Communications volume"
      description="Logged communications per period, stacked by channel."
      isLoading={isLoading}
      isEmpty={total === 0}
      onExport={() =>
        downloadCsv(
          "communications-volume",
          ["Period", ...channels.map((c) => c.label)],
          points.map((p) => [
            String(p.label),
            ...channels.map((c) => Number(p[c.key]) || 0),
          ]),
        )
      }
      footer={<span>{total} communications in this range.</span>}
    >
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={points} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
          <XAxis dataKey="label" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {channels.map((c) => (
            <Bar
              key={c.key}
              dataKey={c.key}
              name={c.label}
              stackId="a"
              fill={CHANNEL_COLOR[c.key] ?? "#8A8478"}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ReportCard>
  );
};
