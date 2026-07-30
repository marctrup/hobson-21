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

export const CommsByChannelCard = () => {
  const { data, isLoading } = useCommsByChannel(30);
  const total = (data ?? []).reduce((a, r) => a + r.count, 0);

  return (
    <div className="bg-white border border-bone rounded-lg p-4 h-full">
      <div className="text-xs font-medium uppercase tracking-wide text-ink-muted">
        Communications by channel · last 30 days
      </div>
      {isLoading ? (
        <div className="text-sm text-ink-muted mt-2">Loading…</div>
      ) : total === 0 ? (
        <div className="mt-6 text-center text-sm text-ink-muted py-8">
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
                    fill={CHANNEL_COLOR[b.channel] ?? "#8A8478"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      {total > 0 && (
        <div className="text-xs text-ink-muted mt-1 text-center">
          {total} communication{total === 1 ? "" : "s"} in last 30 days
        </div>
      )}
    </div>
  );
};
