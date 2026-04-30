// Activity & engagement hooks:
// - useCommunicationsVolume (stacked by channel, time-bucketed)
// - useInboundOutboundRatio (per bucket)
// - useStaleClientsTrend (count of clients with no contact >30d at week-ends)

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useReportsFilters } from "@/components/crm/reports/ReportsFiltersContext";
import {
  COMM_CHANNEL_LABELS,
  type CommChannel,
} from "@/lib/crm/communicationsLabels";

export interface ChannelStackPoint {
  label: string;
  [key: string]: string | number;
}

export interface CommsVolumeResult {
  points: ChannelStackPoint[];
  channels: { key: CommChannel; label: string }[];
}

export const useCommunicationsVolume = () => {
  const { startDate, endDate, ownerId, buckets, bucket } = useReportsFilters();
  return useQuery({
    queryKey: [
      "report-comms-volume",
      startDate.toISOString(),
      endDate.toISOString(),
      ownerId,
      bucket,
    ],
    queryFn: async (): Promise<CommsVolumeResult> => {
      let q = supabase
        .from("communications")
        .select("channel,occurred_at,logged_by")
        .gte("occurred_at", startDate.toISOString())
        .lt("occurred_at", endDate.toISOString())
        .limit(1000);
      if (ownerId !== "all") q = q.eq("logged_by", ownerId);
      const { data, error } = await q;
      if (error) throw error;

      const channelSet = new Set<CommChannel>();
      for (const r of data ?? []) channelSet.add(r.channel as CommChannel);
      const channels = Array.from(channelSet).map((k) => ({
        key: k,
        label: COMM_CHANNEL_LABELS[k] ?? k,
      }));

      const points = buckets.map((b) => {
        const pt: ChannelStackPoint = { label: b.label };
        for (const c of channels) pt[c.key] = 0;
        for (const r of data ?? []) {
          const t = new Date(r.occurred_at).getTime();
          if (t >= b.start.getTime() && t < b.end.getTime()) {
            const k = r.channel as string;
            pt[k] = (Number(pt[k]) || 0) + 1;
          }
        }
        return pt;
      });
      return { points, channels };
    },
  });
};

export interface DirectionPoint {
  label: string;
  inbound: number;
  outbound: number;
  internal: number;
}

export const useInboundOutboundRatio = () => {
  const { startDate, endDate, ownerId, buckets, bucket } = useReportsFilters();
  return useQuery({
    queryKey: [
      "report-inbound-outbound",
      startDate.toISOString(),
      endDate.toISOString(),
      ownerId,
      bucket,
    ],
    queryFn: async (): Promise<DirectionPoint[]> => {
      let q = supabase
        .from("communications")
        .select("direction,occurred_at,logged_by")
        .gte("occurred_at", startDate.toISOString())
        .lt("occurred_at", endDate.toISOString())
        .limit(1000);
      if (ownerId !== "all") q = q.eq("logged_by", ownerId);
      const { data, error } = await q;
      if (error) throw error;

      return buckets.map((b) => {
        let inbound = 0;
        let outbound = 0;
        let internal = 0;
        for (const r of data ?? []) {
          const t = new Date(r.occurred_at).getTime();
          if (t >= b.start.getTime() && t < b.end.getTime()) {
            if (r.direction === "inbound") inbound += 1;
            else if (r.direction === "outbound") outbound += 1;
            else internal += 1;
          }
        }
        return { label: b.label, inbound, outbound, internal };
      });
    },
  });
};

export interface StalePoint {
  label: string;
  stale_count: number;
}

const CLOSED_STATUSES = ["won", "lost", "archived"];

export const useStaleClientsTrend = () => {
  const { ownerId, buckets } = useReportsFilters();
  return useQuery({
    queryKey: ["report-stale-trend", ownerId, buckets.length, buckets[0]?.label],
    queryFn: async (): Promise<StalePoint[]> => {
      let q = supabase
        .from("crm_clients")
        .select(
          "id,owner_id,status,last_contact_date,updated_at,created_at",
        )
        .not("status", "in", `(${CLOSED_STATUSES.join(",")})`)
        .limit(1000);
      if (ownerId !== "all") q = q.eq("owner_id", ownerId);
      const { data, error } = await q;
      if (error) throw error;

      // For each bucket end, count clients whose effective last activity was >30d before that point
      // AND who were created before that point.
      const thirtyDays = 30 * 24 * 60 * 60 * 1000;
      return buckets.map((b) => {
        const asOf = b.end.getTime();
        let stale = 0;
        for (const c of data ?? []) {
          const created = new Date(c.created_at).getTime();
          if (created > asOf) continue;
          const candidates: number[] = [created];
          if (c.last_contact_date)
            candidates.push(new Date(c.last_contact_date).getTime());
          if (c.updated_at) candidates.push(new Date(c.updated_at).getTime());
          const eff = Math.max(...candidates);
          if (asOf - eff > thirtyDays) stale += 1;
        }
        return { label: b.label, stale_count: stale };
      });
    },
  });
};
