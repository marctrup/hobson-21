import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useCommsByChannel } from "@/hooks/crm/dashboard/useCommsByChannel";

const CHANNEL_COLOR: Record<string, string> = {
  email: "#3b82f6",
  call: "#10b981",
  meeting: "#a855f7",
  video_call: "#8b5cf6",
  sms: "#f59e0b",
  whatsapp: "#22c55e",
  linkedin_message: "#0ea5e9",
  letter: "#64748b",
  other: "#94a3b8",
};

export const CommsByChannelCard = () => {
  const { data, isLoading } = useCommsByChannel(30);
  const total = (data ?? []).reduce((a, r) => a + r.count, 0);

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 h-full">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
        Communications by channel · last 30 days
      </div>
      {isLoading ? (
        <div className="text-sm text-slate-500 mt-2">Loading…</div>
      ) : total === 0 ? (
        <div className="mt-6 text-center text-sm text-slate-500 py-8">
          No communications in the last 30 days.
        </div>
      ) : (
        <div className="mt-2" style={{ height: 240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
            >
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
              <YAxis
                type="category"
                dataKey="label"
                tick={{ fontSize: 11 }}
                width={90}
              />
              <Tooltip formatter={(v: number) => [`${v}`, "Count"]} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {(data ?? []).map((b) => (
                  <Cell
                    key={b.channel}
                    fill={CHANNEL_COLOR[b.channel] ?? "#94a3b8"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      {total > 0 && (
        <div className="text-xs text-slate-500 mt-1 text-center">
          {total} communication{total === 1 ? "" : "s"} in last 30 days
        </div>
      )}
    </div>
  );
};
