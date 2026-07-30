import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { usePipelineDistribution } from "@/hooks/crm/dashboard/usePipelineDistribution";

// Map pipeline-stage colour token names to actual hex for chart slices.
// (Recharts can't read CSS variables at render time without extra wiring.)
const COLOR_HEX: Record<string, string> = {
  muted: "#8A8478",       // slate-400
  secondary: "#56514A",   // blue-500
  accent: "#8A8478",      // purple-500
  primary: "#8F5A14",     // amber-500
  success: "#5E6B33",     // emerald-500
  destructive: "#9C4A38", // rose-500
};

export const PipelineDistributionCard = () => {
  const { data, isLoading } = usePipelineDistribution();
  const slices = (data ?? []).filter((s) => s.count > 0);
  const total = slices.reduce((acc, s) => acc + s.count, 0);

  return (
    <div className="bg-white border border-bone rounded-lg p-4 h-full">
      <div className="text-xs font-medium uppercase tracking-wide text-ink-muted">
        Pipeline stage distribution
      </div>
      {isLoading ? (
        <div className="text-sm text-ink-muted mt-2">Loading…</div>
      ) : total === 0 ? (
        <div className="mt-6 text-center text-sm text-ink-muted py-8">
          No clients in the pipeline yet.
        </div>
      ) : (
        <div className="mt-2" style={{ height: 240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={slices}
                dataKey="count"
                nameKey="label"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
              >
                {slices.map((s) => (
                  <Cell
                    key={s.key}
                    fill={COLOR_HEX[s.color] ?? COLOR_HEX.muted}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(v: number, name) => [`${v} clients`, name as string]}
              />
              <Legend
                iconType="circle"
                wrapperStyle={{ fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
      {total > 0 && (
        <div className="text-xs text-ink-muted mt-1 text-center">
          {total} client{total === 1 ? "" : "s"} total
        </div>
      )}
    </div>
  );
};
