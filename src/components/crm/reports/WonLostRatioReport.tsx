import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { ReportCard } from "./ReportCard";
import { useWonLostRatio } from "@/hooks/crm/reports/usePipelineReports";
import { downloadCsv } from "@/lib/crm/reportsExport";

const COLORS: Record<string, string> = {
  Won: "#10b981",
  Lost: "#f43f5e",
  Open: "#94a3b8",
};

export const WonLostRatioReport = () => {
  const { data, isLoading } = useWonLostRatio();
  const slices = data
    ? [
        { name: "Won", value: data.won },
        { name: "Lost", value: data.lost },
        { name: "Open", value: data.open },
      ].filter((s) => s.value > 0)
    : [];
  const wonRate =
    data && data.won + data.lost > 0
      ? Math.round((data.won / (data.won + data.lost)) * 100)
      : null;

  return (
    <ReportCard
      title="Won / lost ratio"
      description="Distribution of clients created in this range by current outcome."
      isLoading={isLoading}
      isEmpty={!data || data.total === 0}
      onExport={() =>
        downloadCsv(
          "won-lost-ratio",
          ["Outcome", "Count"],
          [
            ["Won", data?.won ?? 0],
            ["Lost", data?.lost ?? 0],
            ["Open", data?.open ?? 0],
          ],
        )
      }
      footer={
        wonRate !== null ? (
          <span>
            <span className="font-medium text-slate-700">{wonRate}%</span> win
            rate (closed deals only).
          </span>
        ) : (
          "No closed deals in this range."
        )
      }
    >
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={slices}
            dataKey="value"
            nameKey="name"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
          >
            {slices.map((s) => (
              <Cell key={s.name} fill={COLORS[s.name]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </ReportCard>
  );
};
