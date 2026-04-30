import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import {
  TASK_PRIORITIES,
  TASK_PRIORITY_LABELS,
  TASK_STATUSES,
  TASK_STATUS_LABELS,
  type TaskPriority,
  type TaskStatus,
} from "@/lib/crm/tasksLabels";
import type { TaskListFilters } from "@/hooks/crm/useTasks";

interface Props {
  value: TaskListFilters;
  onChange: (next: TaskListFilters) => void;
  showSearch?: boolean;
  /** Show "Include cancelled" toggle. Cancelled is hidden by default (A4). */
  showIncludeCancelled?: boolean;
}

export const TaskFilters = ({
  value,
  onChange,
  showSearch,
  showIncludeCancelled,
}: Props) => {
  const [statusOpen, setStatusOpen] = useState(false);
  const [priorityOpen, setPriorityOpen] = useState(false);

  const statuses = value.statuses ?? [];
  const priorities = value.priorities ?? [];

  const toggle = <T extends string>(arr: T[], v: T): T[] =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

  const hasFilters =
    statuses.length > 0 ||
    priorities.length > 0 ||
    !!value.search ||
    !!value.tag ||
    value.assigneeId != null ||
    value.overdueOnly ||
    value.dueTodayOnly ||
    value.standaloneOnly;

  const clearAll = () =>
    onChange({
      clientId: value.clientId,
      hideClosed: value.hideClosed,
      includeCancelled: value.includeCancelled,
      statuses: [],
      priorities: [],
      search: "",
      tag: "",
      assigneeId: null,
      overdueOnly: false,
      dueTodayOnly: false,
      standaloneOnly: false,
    });

  return (
    <div className="flex flex-wrap items-center gap-2">
      {showSearch && (
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <Input
            value={value.search ?? ""}
            onChange={(e) => onChange({ ...value, search: e.target.value })}
            placeholder="Search title or notes"
            className="pl-8 bg-white"
          />
        </div>
      )}

      <Popover open={statusOpen} onOpenChange={setStatusOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="bg-white">
            Status {statuses.length > 0 && `(${statuses.length})`}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56" align="start">
          <div className="space-y-1.5">
            {TASK_STATUSES.map((s) => (
              <label
                key={s}
                className="flex items-center gap-2 text-sm cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={statuses.includes(s)}
                  onChange={() =>
                    onChange({
                      ...value,
                      statuses: toggle<TaskStatus>(statuses, s),
                    })
                  }
                />
                {TASK_STATUS_LABELS[s]}
              </label>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <Popover open={priorityOpen} onOpenChange={setPriorityOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="bg-white">
            Priority {priorities.length > 0 && `(${priorities.length})`}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48" align="start">
          <div className="space-y-1.5">
            {TASK_PRIORITIES.map((p) => (
              <label
                key={p}
                className="flex items-center gap-2 text-sm cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={priorities.includes(p)}
                  onChange={() =>
                    onChange({
                      ...value,
                      priorities: toggle<TaskPriority>(priorities, p),
                    })
                  }
                />
                {TASK_PRIORITY_LABELS[p]}
              </label>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <Input
        value={value.tag ?? ""}
        onChange={(e) => onChange({ ...value, tag: e.target.value })}
        placeholder="Tag"
        className="bg-white w-[120px]"
      />

      <label className="flex items-center gap-1.5 text-sm bg-white border border-slate-200 rounded-md px-2.5 py-1.5 cursor-pointer">
        <input
          type="checkbox"
          checked={!!value.overdueOnly}
          onChange={(e) =>
            onChange({ ...value, overdueOnly: e.target.checked })
          }
        />
        Overdue
      </label>

      <label className="flex items-center gap-1.5 text-sm bg-white border border-slate-200 rounded-md px-2.5 py-1.5 cursor-pointer">
        <input
          type="checkbox"
          checked={!!value.dueTodayOnly}
          onChange={(e) =>
            onChange({ ...value, dueTodayOnly: e.target.checked })
          }
        />
        Due today
      </label>

      {showIncludeCancelled && (
        <label className="flex items-center gap-2 text-sm bg-white border border-slate-200 rounded-md px-2.5 py-1.5 cursor-pointer">
          <Switch
            checked={!!value.includeCancelled}
            onCheckedChange={(checked) =>
              onChange({ ...value, includeCancelled: checked })
            }
          />
          Include cancelled
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
