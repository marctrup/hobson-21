import { useMemo } from "react";
import { Check, ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useSubSectors, type SubSector } from "@/hooks/crm/useSubSectors";

interface Props {
  sector: string;
  value: string[]; // sub_sector_id[]
  onChange: (next: string[]) => void;
  disabled?: boolean;
  placeholder?: string;
}

/**
 * Multi-select checkbox dropdown for sub-sectors. Filters options by the
 * currently selected sector. Caller is responsible for hiding this entirely
 * when the sector has no sub-sector taxonomy.
 */
export function SubSectorMultiSelect({
  sector,
  value,
  onChange,
  disabled,
  placeholder = "Select sub-sectors…",
}: Props) {
  const { data: all, isLoading } = useSubSectors();

  const options: SubSector[] = useMemo(
    () => (all ?? []).filter((s) => s.sector === sector),
    [all, sector],
  );

  const selectedSet = useMemo(() => new Set(value), [value]);
  const selectedLabels = options
    .filter((o) => selectedSet.has(o.id))
    .map((o) => o.label);

  const toggle = (id: string) => {
    if (selectedSet.has(id)) onChange(value.filter((v) => v !== id));
    else onChange([...value, id]);
  };

  return (
    <Popover>
      <PopoverTrigger asChild disabled={disabled || isLoading || options.length === 0}>
        <button
          type="button"
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm",
            "ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
        >
          <span className={cn("truncate text-left", selectedLabels.length === 0 && "text-muted-foreground")}>
            {selectedLabels.length === 0
              ? placeholder
              : selectedLabels.join(", ")}
          </span>
          <ChevronDown className="ml-2 size-4 opacity-50 shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-1" align="start">
        {options.length === 0 ? (
          <div className="px-3 py-2 text-sm text-muted-foreground">No options.</div>
        ) : (
          <ul className="max-h-72 overflow-y-auto">
            {options.map((o) => {
              const checked = selectedSet.has(o.id);
              return (
                <li key={o.id}>
                  <button
                    type="button"
                    onClick={() => toggle(o.id)}
                    className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent text-left"
                  >
                    <Checkbox checked={checked} className="pointer-events-none" />
                    <span className="flex-1">{o.label}</span>
                    {checked && <Check className="size-4 text-primary" />}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
}
