import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Info } from "lucide-react";
import { ReportCard } from "./ReportCard";
import { useStageConversionFunnel } from "@/hooks/crm/reports/usePipelineReports";
import { downloadCsv } from "@/lib/crm/reportsExport";

export const StageConversionFunnelReport = () => {
  const { data, isLoading } = useStageConversionFunnel();
  const steps = data ?? [];
  const total = steps.reduce((a, s) => a + s.count, 0);

  return (
    <ReportCard
      title="Stage conversion funnel"
      description="Clients currently sitting at each non-terminal pipeline stage."
      isLoading={isLoading}
      isEmpty={total === 0}
      onExport={() =>
        downloadCsv(
          "stage-funnel",
          ["Stage", "Clients"],
          steps.map((s) => [s.label, s.count]),
        )
      }
      footer={
        <span className="inline-flex items-center gap-1">
          <Info className="size-3" />
          Showing current-stage snapshot — full stage-change history is being
          collected and the funnel will deepen over time.
        </span>
      }
    >
      <ResponsiveContainer width="100%" height={240}>
        <BarChart
          data={steps}
          layout="vertical"
          margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
        >
          <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
          <YAxis
            type="category"
            dataKey="label"
            tick={{ fontSize: 11 }}
            width={110}
          />
          <Tooltip formatter={(v: number) => [`${v}`, "Clients"]} />
          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
            {steps.map((s) => (
              <Cell key={s.key} fill="#6366f1" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ReportCard>
  );
};
