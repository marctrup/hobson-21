import { useEffect, useRef, useState } from "react";
import { Pencil, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useUpdateWorkspaceName,
  useWorkspaceName,
} from "@/hooks/crm/useWorkspaceName";

const MAX_LEN = 80;

export function WorkspaceNameField() {
  const { name, isLoading } = useWorkspaceName();
  const update = useUpdateWorkspaceName();

  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      setValue(name);
      // focus on next tick after input mounts
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [editing, name]);

  const handleSave = async () => {
    const trimmed = value.trim();
    if (trimmed.length < 1 || trimmed.length > MAX_LEN) {
      toast.error(`Workspace name must be between 1 and ${MAX_LEN} characters`);
      return;
    }
    try {
      await update.mutateAsync(trimmed);
      toast.success("Workspace name updated");
      setEditing(false);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to update workspace name";
      toast.error(message);
      // stay in edit mode
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5">
      <div className="text-sm font-medium">Workspace name</div>
      <p className="text-sm text-slate-500 mt-0.5">
        Shown in the sidebar and across the CRM.
      </p>

      <div className="mt-4">
        {editing ? (
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <Input
              ref={inputRef}
              value={value}
              maxLength={MAX_LEN}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  void handleSave();
                } else if (e.key === "Escape") {
                  e.preventDefault();
                  setEditing(false);
                }
              }}
              disabled={update.isPending}
              className="sm:max-w-sm"
              aria-label="Workspace name"
            />
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={() => void handleSave()}
                disabled={update.isPending || value.trim() === name}
              >
                {update.isPending ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin mr-1" />
                    Saving…
                  </>
                ) : (
                  "Save"
                )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setEditing(false)}
                disabled={update.isPending}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-900 font-medium">
              {isLoading ? "Loading…" : name}
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setEditing(true)}
              disabled={isLoading}
              className="gap-1 text-slate-600"
            >
              <Pencil className="size-3.5" />
              Edit
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
