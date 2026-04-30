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
  ISSUE_CATEGORIES,
  ISSUE_CATEGORY_LABELS,
  ISSUE_PRIORITIES,
  ISSUE_PRIORITY_LABELS,
  ISSUE_STATUSES,
  ISSUE_STATUS_LABELS,
  type IssueCategory,
  type IssuePriority,
  type IssueStatus,
} from "@/lib/crm/issuesLabels";
import type { IssueListFilters } from "@/hooks/crm/useIssues";

interface Props {
  value: IssueListFilters;
  onChange: (next: IssueListFilters) => void;
  showSearch?: boolean;
  showHideResolved?: boolean;
}

export const IssueFilters = ({
  value,
  onChange,
  showSearch,
  showHideResolved,
}: Props) => {
  const [statusOpen, setStatusOpen] = useState(false);
  const [priorityOpen, setPriorityOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const statuses = value.statuses ?? [];
  const priorities = value.priorities ?? [];
  const categories = value.categories ?? [];

  const toggle = <T extends string>(arr: T[], v: T): T[] =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

  const hasFilters =
    statuses.length > 0 ||
    priorities.length > 0 ||
    categories.length > 0 ||
    !!value.search ||
    !!value.tag ||
    value.assigneeId != null ||
    value.overdueOnly;

  const clearAll = () =>
    onChange({
      clientId: value.clientId,
      hideResolved: value.hideResolved,
      statuses: [],
      priorities: [],
      categories: [],
      search: "",
      tag: "",
      assigneeId: null,
      reportedBy: null,
      overdueOnly: false,
    });

  return (
    <div className="flex flex-wrap items-center gap-2">
      {showSearch && (
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <Input
            value={value.search ?? ""}
            onChange={(e) => onChange({ ...value, search: e.target.value })}
            placeholder="Search title or description"
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
            {ISSUE_STATUSES.map((s) => (
              <label key={s} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={statuses.includes(s)}
                  onChange={() =>
                    onChange({
                      ...value,
                      statuses: toggle<IssueStatus>(statuses, s),
                    })
                  }
                />
                {ISSUE_STATUS_LABELS[s]}
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
            {ISSUE_PRIORITIES.map((p) => (
              <label key={p} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={priorities.includes(p)}
                  onChange={() =>
                    onChange({
                      ...value,
                      priorities: toggle<IssuePriority>(priorities, p),
                    })
                  }
                />
                {ISSUE_PRIORITY_LABELS[p]}
              </label>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="bg-white">
            Category {categories.length > 0 && `(${categories.length})`}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56" align="start">
          <div className="space-y-1.5">
            {ISSUE_CATEGORIES.map((c) => (
              <label key={c} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={categories.includes(c)}
                  onChange={() =>
                    onChange({
                      ...value,
                      categories: toggle<IssueCategory>(categories, c),
                    })
                  }
                />
                {ISSUE_CATEGORY_LABELS[c]}
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

      {showHideResolved && (
        <label className="flex items-center gap-2 text-sm bg-white border border-slate-200 rounded-md px-2.5 py-1.5 cursor-pointer">
          <Switch
            checked={!value.hideResolved}
            onCheckedChange={(checked) =>
              onChange({ ...value, hideResolved: !checked })
            }
          />
          Include resolved
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
