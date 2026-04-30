import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type Preview = {
  client_name: string | null;
  contacts_count: number;
  communications_count: number;
  issues_count: number;
  issue_comments_count: number;
  tasks_count: number;
  notes_count: number;
  attachments_count: number;
};

interface Props {
  clientId: string;
  clientName: string;
  onDeleted: () => void;
}

export function DeleteClientDialog({ clientId, clientName, onDeleted }: Props) {
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");

  const preview = useQuery({
    queryKey: ["crm-client-delete-preview", clientId],
    enabled: open,
    queryFn: async (): Promise<Preview> => {
      const { data, error } = await supabase
        .rpc("crm_get_client_delete_preview", { p_client_id: clientId });
      if (error) throw error;
      const row = Array.isArray(data) ? data[0] : data;
      if (!row) throw new Error("No preview data returned");
      return row as Preview;
    },
  });

  const del = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.rpc("crm_delete_client", { p_client_id: clientId });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Client deleted" });
      setOpen(false);
      onDeleted();
    },
    onError: (e: Error) =>
      toast({ title: "Delete failed", description: e.message, variant: "destructive" }),
  });

  // Reset typed value whenever the dialog re-opens
  useEffect(() => {
    if (open) setTyped("");
  }, [open]);

  const nameMatches =
    typed.trim().toLowerCase() === clientName.trim().toLowerCase();
  const canConfirm = preview.isSuccess && nameMatches && !del.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-rose-600">
          <Trash2 className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Delete client</DialogTitle>
        </DialogHeader>

        <div className="rounded-md border border-rose-200 bg-rose-50 p-3 flex gap-2 text-sm text-rose-800">
          <AlertTriangle className="size-4 mt-0.5 shrink-0" />
          <div>This action is permanent and cannot be undone.</div>
        </div>

        <div className="space-y-3 text-sm text-slate-700">
          <div>
            This will permanently remove <strong>{clientName}</strong> and all associated data:
          </div>

          {preview.isLoading && (
            <div className="flex items-center gap-2 text-slate-500">
              <Loader2 className="size-4 animate-spin" /> Loading counts…
            </div>
          )}

          {preview.error && (
            <div className="text-rose-600">
              Could not load dependent record counts: {(preview.error as Error).message}
            </div>
          )}

          {preview.data && (
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li><strong>{preview.data.contacts_count}</strong> contacts</li>
              <li>
                <strong>{preview.data.communications_count}</strong> communications
                (with <strong>{preview.data.attachments_count}</strong> attachments)
              </li>
              <li>
                <strong>{preview.data.issues_count}</strong> issues with{" "}
                <strong>{preview.data.issue_comments_count}</strong> comments
              </li>
              <li><strong>{preview.data.tasks_count}</strong> tasks</li>
              <li><strong>{preview.data.notes_count}</strong> notes</li>
            </ul>
          )}

          <div className="text-xs text-slate-500 pt-1">
            The per-client activity timeline will be removed along with the client. A separate
            audit record of this deletion will be preserved in the workspace security log for
            compliance.
          </div>

          <div className="pt-2">
            <Label htmlFor="confirm-name" className="text-sm">
              To confirm, type the client name below:{" "}
              <span className="font-semibold">{clientName}</span>
            </Label>
            <Input
              id="confirm-name"
              autoComplete="off"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder={`Type "${clientName}" to confirm`}
              className="mt-1"
              disabled={del.isPending}
            />
            {typed.length > 0 && !nameMatches && (
              <div className="text-xs text-rose-600 mt-1">
                Name doesn't match. Type exactly: <strong>{clientName}</strong>
              </div>
            )}
            {preview.isLoading && (
              <div className="text-xs text-slate-500 mt-1">
                Waiting for record counts to load…
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={del.isPending}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={!canConfirm}
            onClick={() => del.mutate()}
          >
            {del.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin mr-1" /> Deleting…
              </>
            ) : (
              "Delete client"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
