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
import { useTasksCompletedVsCreated } from "@/hooks/crm/reports/useServiceReports";
import { downloadCsv } from "@/lib/crm/reportsExport";

export const TasksFlowReport = () => {
  const { data, isLoading } = useTasksCompletedVsCreated();
  const points = data ?? [];
  const total = points.reduce((a, p) => a + p.created + p.completed, 0);

  return (
    <ReportCard
      title="Tasks created vs completed"
      description="Throughput of task creation versus completion."
      isLoading={isLoading}
      isEmpty={total === 0}
      onExport={() =>
        downloadCsv(
          "tasks-created-completed",
          ["Period", "Created", "Completed"],
          points.map((p) => [p.label, p.created, p.completed]),
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
            dataKey="created"
            name="Created"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="completed"
            name="Completed"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ReportCard>
  );
};
