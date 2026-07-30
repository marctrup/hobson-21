import { useState } from "react";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useRecentCommunications } from "@/hooks/crm/dashboard/useRecentCommunications";
import { ChannelIcon } from "@/components/crm/communications/ChannelIcon";
import { CommunicationSidePanel } from "@/components/crm/communications/CommunicationSidePanel";
import { formatDateTimeUK } from "@/lib/crm/labels";

const relTime = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return formatDateTimeUK(iso);
};

export const RecentCommunicationsCard = () => {
  const { data, isLoading } = useRecentCommunications(20);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="bg-white border border-bone rounded-lg h-full flex flex-col">
      <div className="px-4 py-3 border-b border-bone flex items-center justify-between">
        <h2 className="font-medium">Recent communications</h2>
        <Link
          to="/crm/communications"
          className="text-sm text-charcoal hover:text-ink"
        >
          View all →
        </Link>
      </div>
      {isLoading ? (
        <div className="p-6 text-sm text-ink-muted">Loading…</div>
      ) : !data || data.length === 0 ? (
        <div className="p-8 text-center text-sm text-ink-muted">
          No communications logged yet.{" "}
          <Link
            to="/crm/communications"
            className="text-ink underline"
          >
            Log one
          </Link>
          .
        </div>
      ) : (
        <ul className="divide-y divide-faint-rule overflow-y-auto" style={{ maxHeight: 480 }}>
          {data.map((r) => (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => setSelectedId(r.id)}
                className="w-full text-left flex items-start gap-3 px-4 py-3 hover:bg-paper"
              >
                <div className="mt-0.5 size-7 rounded-md bg-bone-wash text-charcoal flex items-center justify-center shrink-0">
                  <ChannelIcon channel={r.channel} className="size-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-sm text-ink truncate">
                      {r.client_name}
                    </span>
                    {r.is_important && (
                      <Star className="size-3.5 text-warning fill-warning shrink-0" />
                    )}
                  </div>
                  <div className="text-xs text-charcoal truncate">
                    {r.subject || r.summary || "(no subject)"}
                  </div>
                  <div className="text-[11px] text-ink-muted mt-0.5">
                    {relTime(r.occurred_at)}
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      <CommunicationSidePanel
        open={!!selectedId}
        onOpenChange={(o) => !o && setSelectedId(null)}
        communicationId={selectedId}
      />
    </div>
  );
};
