import { useState } from "react";
import { Loader2, RotateCw, Copy, Check, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useIntegrationSettings,
  useRotateIngestSecret,
} from "@/hooks/crm/useIntegrationSettings";

function formatDate(iso: string | null): string {
  if (!iso) return "Never";
  try {
    return new Date(iso).toLocaleString("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export function IngestSecretCard() {
  const { data: settings, isLoading } = useIntegrationSettings();
  const rotate = useRotateIngestSecret();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const [revealed, setRevealed] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const isConfigured = Boolean(settings?.secret_configured);

  const handleRotate = async () => {
    try {
      const result = await rotate.mutateAsync();
      setRevealed(result.secret);
      setAcknowledged(false);
      setConfirmOpen(false);
      toast.success("Secret rotated. Copy it now — it will not be shown again.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Rotation failed";
      toast.error(message);
    }
  };

  const handleCopy = async () => {
    if (!revealed) return;
    try {
      await navigator.clipboard.writeText(revealed);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy to clipboard");
    }
  };

  const closeReveal = () => {
    setRevealed(null);
    setCopied(false);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5">
      <div className="text-sm font-medium">Website ingest secret</div>
      <p className="text-sm text-slate-500 mt-0.5">
        Used by the public website to authenticate lead/contact submissions.
      </p>

      <dl className="mt-4 grid grid-cols-1 gap-2 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-slate-500">Status</dt>
          <dd className="font-medium">
            {isLoading
              ? "—"
              : isConfigured
              ? <span className="text-emerald-700">Configured</span>
              : <span className="text-amber-700">Not configured</span>}
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-slate-500">Last rotated</dt>
          <dd className="font-medium">
            {formatDate(settings?.website_ingest_secret_rotated_at ?? null)}
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-slate-500">System user</dt>
          <dd className="font-mono text-xs text-slate-600 truncate max-w-[180px]">
            {settings?.website_system_user_id ?? "—"}
          </dd>
        </div>
      </dl>

      {!isConfigured && (
        <div className="mt-3 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          Generate the first secret to activate the website ingest.
        </div>
      )}

      <div className="mt-4">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setConfirmOpen(true)}
          disabled={isLoading || rotate.isPending}
        >
          <RotateCw className="size-3.5 mr-1.5" />
          {isConfigured ? "Rotate secret" : "Generate secret"}
        </Button>
      </div>

      {/* Confirmation modal */}
      <Dialog
        open={confirmOpen}
        onOpenChange={(o) => {
          if (!rotate.isPending) {
            setConfirmOpen(o);
            if (!o) setAcknowledged(false);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-amber-600" />
              {isConfigured ? "Rotate website ingest secret?" : "Generate website ingest secret?"}
            </DialogTitle>
            <DialogDescription className="space-y-2 pt-2 text-slate-700">
              <span className="block">
                {isConfigured
                  ? "Rotating immediately invalidates the current secret. The website will stop submitting leads until you paste the new value into the Lovable Cloud secrets panel for the website project."
                  : "This generates a new secret. The website will not submit leads until you paste the value into the Lovable Cloud secrets panel for the website project."}
              </span>
              <span className="block">
                The new secret is shown <strong>once</strong> — copy it immediately.
              </span>
            </DialogDescription>
          </DialogHeader>

          <label className="flex items-start gap-2 text-sm text-slate-800 mt-2">
            <Checkbox
              checked={acknowledged}
              onCheckedChange={(v) => setAcknowledged(Boolean(v))}
              disabled={rotate.isPending}
              className="mt-0.5"
            />
            <span>I have my Lovable Cloud secrets panel ready and understand the website integration will break until I paste the new value.</span>
          </label>

          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={rotate.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={() => void handleRotate()}
              disabled={!acknowledged || rotate.isPending}
            >
              {rotate.isPending ? (
                <>
                  <Loader2 className="size-3.5 animate-spin mr-1.5" />
                  Rotating…
                </>
              ) : (
                "Confirm rotation"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reveal-once modal */}
      <Dialog open={Boolean(revealed)} onOpenChange={(o) => !o && closeReveal()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New ingest secret</DialogTitle>
            <DialogDescription>
              Copy this value now and store it in the Lovable Cloud secrets panel of the website project. It will not be shown again.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-3 font-mono text-xs break-all">
            {revealed}
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={handleCopy}>
              {copied ? (
                <>
                  <Check className="size-3.5 mr-1.5" /> Copied
                </>
              ) : (
                <>
                  <Copy className="size-3.5 mr-1.5" /> Copy to clipboard
                </>
              )}
            </Button>
            <Button onClick={closeReveal}>I&apos;ve saved it</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
