import { useState } from "react";
import { Loader2, Check, ChevronsUpDown, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCrmTeam, type CrmTeamMember } from "@/hooks/crm/useCrmTeam";
import {
  useIntegrationSettings,
  useSetDefaultOwner,
} from "@/hooks/crm/useIntegrationSettings";

export function DefaultOwnerCard() {
  const { data: settings, isLoading } = useIntegrationSettings();
  const { data: team = [], isLoading: teamLoading } = useCrmTeam();
  const setOwner = useSetDefaultOwner();
  const [open, setOpen] = useState(false);

  const eligible = team.filter(
    (m) =>
      m.role === "admin" || m.role === "crm_write" || m.role === "crm_read",
  );
  const current = eligible.find((m) => m.user_id === settings?.default_owner_id);
  const hasOwner = Boolean(settings?.default_owner_id);

  const handlePick = async (member: CrmTeamMember) => {
    setOpen(false);
    try {
      await setOwner.mutateAsync(member.user_id);
      toast.success(`Default owner set to ${member.display_name ?? member.email}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to set default owner";
      toast.error(message);
    }
  };

  const handleClear = async () => {
    try {
      await setOwner.mutateAsync(null);
      toast.success("Default owner cleared");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to clear default owner";
      toast.error(message);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5">
      <div className="text-sm font-medium">Default owner</div>
      <p className="text-sm text-slate-500 mt-0.5">
        Assigned to new clients created via the website ingest.
      </p>

      {!hasOwner && !isLoading && (
        <div className="mt-3 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          No default owner set. Website ingests will fail until one is chosen.
        </div>
      )}

      <div className="mt-4 flex items-center gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              role="combobox"
              aria-expanded={open}
              disabled={isLoading || teamLoading || setOwner.isPending}
              className="justify-between min-w-[260px]"
            >
              <span className="truncate text-left">
                {isLoading
                  ? "Loading…"
                  : current
                  ? `${current.display_name ?? current.email}`
                  : "Select a team member"}
              </span>
              <ChevronsUpDown className="size-4 opacity-50 ml-2 shrink-0" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[320px] p-0" align="start">
            <div className="max-h-72 overflow-y-auto py-1">
              {teamLoading && (
                <div className="px-3 py-2 text-xs text-slate-500">Loading…</div>
              )}
              {!teamLoading && eligible.length === 0 && (
                <div className="px-3 py-2 text-xs text-slate-500">
                  No eligible members.
                </div>
              )}
              {eligible.map((m) => {
                const selected = m.user_id === settings?.default_owner_id;
                return (
                  <button
                    key={m.user_id}
                    type="button"
                    onClick={() => void handlePick(m)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 text-left"
                  >
                    <Check
                      className={`size-4 ${selected ? "opacity-100" : "opacity-0"}`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="truncate font-medium">
                        {m.display_name ?? m.email}
                      </div>
                      <div className="truncate text-xs text-slate-500">
                        {m.email} · {m.role}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>

        {hasOwner && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => void handleClear()}
            disabled={setOwner.isPending}
            className="text-slate-600"
          >
            {setOwner.isPending ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <>
                <X className="size-3.5 mr-1" /> Clear
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
