import { useEffect, useRef, useState } from "react";
import { getDocument, GlobalWorkerOptions, type PDFDocumentProxy } from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PrototypePaper } from "./prototypeDocumentsPaper";

GlobalWorkerOptions.workerSrc = workerUrl;

class PublicWasmFactory {
  async fetch({ filename }: { filename: string }) {
    if (!["openjpeg.wasm", "jbig2.wasm", "qcms_bg.wasm"].includes(filename)) throw new Error("Unsupported PDF decoder");
    const response = await fetch(`${import.meta.env.BASE_URL}wasm/${filename}`);
    if (!response.ok) throw new Error("PDF decoder unavailable");
    return new Uint8Array(await response.arrayBuffer());
  }
}

export default function PrototypeDocumentsPreview({ paper, goTo }: { paper: PrototypePaper; goTo?: { page: number; nonce: number } }) {
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(false);
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    setPage(1); setPdf(null); setError(false);
    if (!paper.url) return;
    const task = getDocument({ url: paper.url, WasmFactory: PublicWasmFactory, useWorkerFetch: false });
    let active = true;
    task.promise.then((loaded) => { if (active) setPdf(loaded); }).catch(() => { if (active) setError(true); });
    return () => { active = false; void task.destroy(); };
  }, [paper.url]);
  useEffect(() => {
    if (!goTo || !pdf) return;
    setPage(Math.max(1, Math.min(pdf.numPages, goTo.page)));
  }, [goTo, pdf]);
  useEffect(() => {
    if (!pdf) return;
    let active = true;
    let rendering: ReturnType<Awaited<ReturnType<PDFDocumentProxy["getPage"]>>["render"]> | undefined;
    pdf.getPage(page).then((sheet) => {
      if (!active || !canvas.current) return;
      const viewport = sheet.getViewport({ scale: 1.6 });
      canvas.current.width = Math.ceil(viewport.width);
      canvas.current.height = Math.ceil(viewport.height);
      rendering = sheet.render({ canvas: canvas.current, viewport });
      rendering.promise.catch((err: Error) => { if (active && err.name !== "RenderingCancelledException") setError(true); });
    }).catch(() => { if (active) setError(true); });
    return () => { active = false; rendering?.cancel(); };
  }, [pdf, page]);
  return (
    <section className="flex min-h-0 flex-1 flex-col" aria-label="Paper preview">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-bone bg-background px-5 py-3">
        <p className="min-w-0 flex-1 break-words text-xs text-ink-muted">{paper.filename}</p>
        <div className="flex shrink-0 items-center gap-1">
          <Button variant="ghost" size="icon" title="Previous page" aria-label="Previous page" disabled={!pdf || page === 1} onClick={() => setPage((n) => n - 1)}><ChevronLeft className="h-4 w-4" /></Button>
          <span className="min-w-20 text-center text-xs text-ink-muted" aria-live="polite">{pdf ? `Page ${page} of ${pdf.numPages}` : "Opening…"}</span>
          <Button variant="ghost" size="icon" title="Next page" aria-label="Next page" disabled={!pdf || page === pdf.numPages} onClick={() => setPage((n) => n + 1)}><ChevronRight className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" asChild><a href={paper.url} target="_blank" rel="noreferrer" aria-label="Open original PDF" title="Open original PDF"><ExternalLink className="h-4 w-4" /></a></Button>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-7">
        {error ? <p role="alert" className="text-sm text-ink-muted">I couldn't open the preview. You can open the original PDF above.</p> : <canvas ref={canvas} aria-label={`Original paper, page ${page}`} className="mx-auto h-auto w-full max-w-[820px] bg-background shadow-md" />}
      </div>
    </section>
  );
}