import { Star, ArrowDownLeft, ArrowUpRight, MoveHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { ChannelIcon } from "./ChannelIcon";
import type { CommunicationRow } from "@/hooks/crm/useCommunications";
import {
  COMM_CHANNEL_LABELS,
  COMM_DIRECTION_BADGE,
  COMM_DIRECTION_LABELS,
} from "@/lib/crm/communicationsLabels";
import { formatDateTimeUK } from "@/lib/crm/labels";
import { cn } from "@/lib/utils";

interface Props {
  rows: CommunicationRow[];
  isLoading: boolean;
  showClient?: boolean;
  onSelect: (id: string) => void;
}

const DirIcon = ({ d }: { d: string }) =>
  d === "inbound" ? (
    <ArrowDownLeft className="size-3.5" />
  ) : d === "outbound" ? (
    <ArrowUpRight className="size-3.5" />
  ) : (
    <MoveHorizontal className="size-3.5" />
  );

export const CommunicationTimeline = ({
  rows,
  isLoading,
  showClient,
  onSelect,
}: Props) => {
  if (isLoading) {
    return <div className="text-sm text-ink-muted p-6">Loading…</div>;
  }
  if (rows.length === 0) {
    return (
      <div className="text-sm text-ink-muted bg-white border border-bone rounded-lg p-8 text-center">
        No communications yet.
      </div>
    );
  }

  return (
    <ol className="space-y-2">
      {rows.map((c) => (
        <li key={c.id}>
          <button
            type="button"
            onClick={() => onSelect(c.id)}
            className="w-full text-left bg-white border border-bone rounded-lg p-3 hover:border-bone hover:shadow-sm transition"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 size-8 rounded-md bg-bone-wash text-charcoal flex items-center justify-center shrink-0">
                <ChannelIcon channel={c.channel} className="size-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-medium",
                      COMM_DIRECTION_BADGE[c.direction],
                    )}
                  >
                    <DirIcon d={c.direction} />
                    {COMM_DIRECTION_LABELS[c.direction]}
                  </span>
                  <span className="text-xs text-ink-muted">
                    {COMM_CHANNEL_LABELS[c.channel]}
                  </span>
                  {c.is_important && (
                    <Star className="size-3.5 text-warning fill-warning" />
                  )}
                  {c.needs_review && (
                    <span className="text-[10px] uppercase tracking-wide text-danger">
                      Needs review
                    </span>
                  )}
                  <span className="ml-auto text-xs text-ink-muted">
                    {formatDateTimeUK(c.occurred_at)}
                  </span>
                </div>
                <div className="mt-1 font-medium text-ink truncate">
                  {c.subject || c.summary || "(no subject)"}
                </div>
                {c.subject && c.summary && (
                  <div className="text-sm text-charcoal truncate">
                    {c.summary}
                  </div>
                )}
                {showClient && c.client_name && (
                  <div className="mt-1 text-xs text-ink-muted">
                    <Link
                      to={`/crm/clients/${c.client_id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="underline hover:text-charcoal"
                    >
                      {c.client_name}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </button>
        </li>
      ))}
    </ol>
  );
};
