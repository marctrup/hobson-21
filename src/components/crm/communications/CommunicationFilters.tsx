import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  COMM_CHANNELS,
  COMM_CHANNEL_LABELS,
  COMM_DIRECTIONS,
  COMM_DIRECTION_LABELS,
  type CommChannel,
  type CommDirection,
} from "@/lib/crm/communicationsLabels";
import type { CommunicationListFilters } from "@/hooks/crm/useCommunications";

interface Props {
  value: CommunicationListFilters;
  onChange: (next: CommunicationListFilters) => void;
  showSearch?: boolean;
  showNeedsReview?: boolean;
}

export const CommunicationFilters = ({
  value,
  onChange,
  showSearch,
  showNeedsReview,
}: Props) => {
  const [channelOpen, setChannelOpen] = useState(false);
  const channels = value.channels ?? [];

  const toggleChannel = (c: CommChannel) => {
    const next = channels.includes(c)
      ? channels.filter((x) => x !== c)
      : [...channels, c];
    onChange({ ...value, channels: next });
  };

  const clearAll = () =>
    onChange({
      clientId: value.clientId,
      channels: [],
      direction: "all",
      search: "",
      needsReviewOnly: false,
      importantOnly: false,
      fromDate: undefined,
      toDate: undefined,
    });

  const hasFilters =
    (channels.length ?? 0) > 0 ||
    value.direction !== "all" ||
    !!value.search ||
    value.needsReviewOnly ||
    value.importantOnly ||
    !!value.fromDate ||
    !!value.toDate;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {showSearch && (
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <Input
            value={value.search ?? ""}
            onChange={(e) => onChange({ ...value, search: e.target.value })}
            placeholder="Search subject, summary, body"
            className="pl-8 bg-white"
          />
        </div>
      )}

      <Select
        value={value.direction ?? "all"}
        onValueChange={(v) =>
          onChange({ ...value, direction: v as CommDirection | "all" })
        }
      >
        <SelectTrigger className="w-[140px] bg-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All directions</SelectItem>
          {COMM_DIRECTIONS.map((d) => (
            <SelectItem key={d} value={d}>
              {COMM_DIRECTION_LABELS[d]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Popover open={channelOpen} onOpenChange={setChannelOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="bg-white">
            Channels {channels.length > 0 && `(${channels.length})`}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56" align="start">
          <div className="space-y-1.5">
            {COMM_CHANNELS.map((c) => (
              <label
                key={c}
                className="flex items-center gap-2 text-sm cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={channels.includes(c)}
                  onChange={() => toggleChannel(c)}
                />
                {COMM_CHANNEL_LABELS[c]}
              </label>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <label className="flex items-center gap-1.5 text-sm bg-white border border-slate-200 rounded-md px-2.5 py-1.5 cursor-pointer">
        <input
          type="checkbox"
          checked={!!value.importantOnly}
          onChange={(e) =>
            onChange({ ...value, importantOnly: e.target.checked })
          }
        />
        Important
      </label>

      {showNeedsReview && (
        <label className="flex items-center gap-1.5 text-sm bg-white border border-slate-200 rounded-md px-2.5 py-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={!!value.needsReviewOnly}
            onChange={(e) =>
              onChange({ ...value, needsReviewOnly: e.target.checked })
            }
          />
          Needs review
        </label>
      )}

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearAll}>
          <X className="size-3.5 mr-1" /> Clear
        </Button>
      )}
    </div>
  );
};
