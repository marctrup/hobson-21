import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

// One tenancy history ("chain") in Papers. The same component shows Proposed, Reading and Confirmed states,
// plus an awaiting state for unresolved papers. Several chains may sit under one Unit; never merge them.
export type ChainStatus = { kind: "current" | "starts" | "ended" | "unconfirmed"; date?: string | null };
export type ChainMode = "proposed" | "reading" | "confirmed" | "awaiting";
export type ChainPaper = { type: string; filename: string; date: string; url?: string; pending?: boolean; note?: string };

const MONTHS: Record<string, string> = { January: "Jan", February: "Feb", March: "Mar", April: "Apr", May: "May", June: "Jun", July: "Jul", August: "Aug", September: "Sep", October: "Oct", November: "Nov", December: "Dec" };
export const shortDate = (d: string) => d.replace(/\b(January|February|March|April|May|June|July|August|September|October|November|December)\b/, (m) => MONTHS[m]);

export function statusLabel(s: ChainStatus): string {
  if (s.kind === "current") return "Current";
  if (s.kind === "starts" && s.date) return `Starts on ${s.date}`;
  if (s.kind === "ended") return s.date ? `Ended on ${s.date}` : "Ended · date not given";
  return "Status unconfirmed";
}

const MODE_MARK: Record<ChainMode, string | null> = { proposed: "Proposed", reading: "Being read", awaiting: "Awaiting confirmation", confirmed: null };

type Props = { heading: string; status: ChainStatus; mode: ChainMode; papers: ChainPaper[]; detail?: string[]; onView?: (p: ChainPaper) => void };

export default function PrototypeDocumentsChain({ heading, status, mode, papers, detail = [], onView }: Props) {
  const mark = MODE_MARK[mode];
  const quiet = mode !== "confirmed";
  return (
    <article aria-label={`${heading} tenancy history${mark ? ` — ${mark.toLowerCase()}` : ""}`} className={`rounded-lg border bg-background ${quiet ? "border-dashed border-primary/50" : "border-bone"}`}>
      <header className="flex flex-wrap items-center gap-2 border-b border-faint-rule px-4 py-3">
        <h4 className="text-sm font-semibold text-ink">{heading}</h4>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${status.kind === "current" ? "bg-secondary text-ink" : "border border-bone text-ink-muted"}`}>{statusLabel(status)}</span>
        {mark && <span className={`ml-auto text-[11px] italic text-primary ${mode === "reading" ? "motion-safe:animate-pulse" : ""}`}>{mode === "reading" ? "I'm reading this" : mark}</span>}
      </header>
      {detail.length > 0 && <div className="space-y-0.5 px-4 pt-3 text-xs text-ink-muted">{detail.map((d) => <p key={d}>{d}</p>)}</div>}
      <ol className="relative px-4 py-3">
        {papers.map((p, i) => (
          <li key={p.filename} className="relative flex gap-3 pb-3 last:pb-0">
            <div className="flex w-3 shrink-0 flex-col items-center pt-1.5" aria-hidden>
              <span className={`h-2.5 w-2.5 rounded-full border-2 ${p.pending ? "border-primary bg-background" : "border-primary bg-primary"}`} />
              {i < papers.length - 1 && <span className="mt-1 w-px flex-1 bg-bone" />}
            </div>
            <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink">{p.type}{p.pending && <span className="ml-2 text-[11px] font-normal italic text-ink-muted">{mode === "reading" ? "being read" : "not yet added"}</span>}</p>
                <p className="mt-0.5 flex items-center gap-1.5 break-words text-xs text-ink"><FileText className="h-3.5 w-3.5 shrink-0 text-ink-muted" aria-hidden />{p.filename}</p>
                <p className="mt-0.5 text-xs text-ink-muted">{shortDate(p.date)}</p>
                {p.note && <p className="mt-0.5 text-[11px] text-ink-muted">{p.note}</p>}
              </div>
              <div className="flex shrink-0 gap-1">
                <Button variant="outline" size="sm" disabled={!p.url} onClick={() => onView?.(p)} aria-label={`View ${p.type}`}>View</Button>
                {mode === "confirmed" && <Button variant="ghost" size="icon" disabled={!p.url} asChild={!!p.url} aria-label={`Download ${p.type}`}>{p.url ? <a href={p.url} download={p.filename}><Download className="h-4 w-4" /></a> : <Download className="h-4 w-4" />}</Button>}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </article>
  );
}
