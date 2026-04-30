import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  COMM_CHANNEL_LABELS,
  type CommChannel,
} from "@/lib/crm/communicationsLabels";

export interface ChannelBucket {
  channel: CommChannel;
  label: string;
  count: number;
}

export const useCommsByChannel = (windowDays = 30) =>
  useQuery({
    queryKey: ["crm-dashboard-comms-by-channel", windowDays],
    queryFn: async (): Promise<ChannelBucket[]> => {
      const since = new Date(
        Date.now() - windowDays * 24 * 60 * 60 * 1000,
      ).toISOString();
      const { data, error } = await supabase
        .from("communications")
        .select("channel")
        .gte("occurred_at", since)
        .limit(1000);
      if (error) throw error;

      const counts = new Map<CommChannel, number>();
      for (const r of data ?? []) {
        const ch = r.channel as CommChannel;
        counts.set(ch, (counts.get(ch) ?? 0) + 1);
      }
      return Array.from(counts.entries())
        .map(([channel, count]) => ({
          channel,
          label: COMM_CHANNEL_LABELS[channel] ?? channel,
          count,
        }))
        .sort((a, b) => b.count - a.count);
    },
  });
