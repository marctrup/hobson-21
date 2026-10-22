import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ImagePlus, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { mainUnitPhoto, removeUnitPhoto, type UnitPhoto, type UnitPhotographs } from "./prototypeUnitPhotos";

type Props = { unit: UnitPhotographs & { name: string }; onChange: (photos: UnitPhotographs) => void };

// A hover preview floats above everything else, so it can be far larger than the row it sits in
// without being clipped by the panel around it.
const PREVIEW_MAX_W = 420;
const PREVIEW_MAX_H = 300;

function useHoverPreview() {
  const [rect, setRect] = useState<DOMRect | null>(null);
  useEffect(() => {
    if (!rect) return;
    const hide = () => setRect(null);
    window.addEventListener("scroll", hide, true);
    window.addEventListener("resize", hide);
    return () => { window.removeEventListener("scroll", hide, true); window.removeEventListener("resize", hide); };
  }, [rect]);
  return {
    rect,
    show: (el: HTMLElement) => setRect(el.getBoundingClientRect()),
    hide: () => setRect(null),
  };
}

function FloatingPreview({ rect, url, alt }: { rect: DOMRect; url: string; alt: string }) {
  const w = Math.min(PREVIEW_MAX_W, window.innerWidth - 16);
  const h = Math.min(PREVIEW_MAX_H, window.innerHeight - 16);
  const gap = 10;
  let left = rect.right + gap;
  if (left + w > window.innerWidth - 8) left = rect.left - w - gap;
  left = Math.min(Math.max(8, left), Math.max(8, window.innerWidth - w - 8));
  let top = rect.top + rect.height / 2 - h / 2;
  top = Math.min(Math.max(8, top), Math.max(8, window.innerHeight - h - 8));
  return createPortal(<div className="pointer-events-none fixed z-[1200] overflow-hidden rounded-lg border border-border bg-background shadow-2xl" style={{ top, left, width: w, height: h }}>
    <img src={url} alt={alt} className="h-full w-full object-cover" />
  </div>, document.body);
}

export function UnitPhotoThumbnail({ unit }: { unit: UnitPhotographs & { name: string } }) {
  const photo = mainUnitPhoto(unit);
  const [open, setOpen] = useState(false);
  const preview = useHoverPreview();
  if (!photo) return null;
  return <>
    <button type="button" aria-label={`Enlarge ${unit.name} photograph`} title="Enlarge photograph"
      onMouseEnter={e => preview.show(e.currentTarget)} onMouseLeave={preview.hide}
      onFocus={e => preview.show(e.currentTarget)} onBlur={preview.hide}
      onClick={() => setOpen(true)}
      className="group/thumb relative z-0 mr-2 h-10 w-10 shrink-0 self-center rounded hover:z-20 focus-visible:z-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <img src={photo.url} alt={`${unit.name} main photograph`} className="h-full w-full rounded object-cover shadow-sm transition-transform duration-200 ease-out group-hover/thumb:scale-[1.15] group-focus-visible/thumb:scale-[1.15] group-hover/thumb:shadow-lg" style={{ transformOrigin: "left center" }} />
    </button>
    {preview.rect && <FloatingPreview rect={preview.rect} url={photo.url} alt={`${unit.name} photograph enlarged`} />}
    <Dialog open={open} onOpenChange={setOpen}><DialogContent className="max-w-3xl"><DialogTitle>{unit.name}</DialogTitle><img src={photo.url} alt={`${unit.name} main photograph`} className="max-h-[70vh] w-full object-contain" /></DialogContent></Dialog>
  </>;
}

export function PrototypeUnitPhotographs({ unit, onChange }: Props) {
  const picker = useRef<HTMLInputElement>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const hover = useHoverPreview();
  const [hoverId, setHoverId] = useState<string | null>(null);
  const latest = useRef(unit);
  latest.current = unit;
  const photos = unit.photos ?? [];
  const preview = photos.find(p => p.id === previewId);
  const main = mainUnitPhoto(unit);

  const take = async (files: FileList | File[]) => {
    const images = Array.from(files).filter(file => file.type.startsWith("image/"));
    if (!images.length) { setError("Please choose photographs."); return; }
    setLoading(true); setError("");
    try {
      const additions = await Promise.all(images.map(file => new Promise<UnitPhoto>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => typeof reader.result === "string" ? resolve({ id: crypto.randomUUID(), name: file.name, url: reader.result }) : reject(new Error());
        reader.onerror = reject;
        reader.readAsDataURL(file);
      })));
      onChange({ photos: [...(latest.current.photos ?? []), ...additions], mainPhotoId: mainUnitPhoto(latest.current)?.id ?? additions[0]?.id });
    } catch { setError("That photograph could not be opened. Please try another."); }
    finally { setLoading(false); }
  };

  const hovered = hover.rect ? photos.find(p => p.id === hoverId) : undefined;

  return <section aria-label={`${unit.name} photographs`} className="mt-3 border-y border-border py-2"
    onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)}
    onDrop={e => { e.preventDefault(); setDragging(false); void take(e.dataTransfer.files); }}>
    <div className={`flex flex-wrap items-center justify-between gap-2 ${dragging ? "bg-secondary" : ""}`}>
      <span className="text-xs font-medium text-muted-foreground">Photographs</span>
      <Button variant="ghost" size="sm" disabled={loading} onClick={() => picker.current?.click()}><ImagePlus className="h-4 w-4" />{loading ? "Opening photographs…" : photos.length ? "Add more photographs" : "Add photographs"}</Button>
      <input ref={picker} type="file" accept="image/*" multiple aria-label={`Choose photographs for ${unit.name}`} className="hidden" onChange={e => { if (e.target.files) void take(e.target.files); e.target.value = ""; }} />
    </div>
    {photos.length > 0 && <ul className="mt-2 flex flex-wrap gap-3">{photos.map(photo => <li key={photo.id} className="w-24">
      <Button variant="ghost" className="relative h-20 w-24 overflow-visible p-0 hover:z-20 focus-visible:z-20" aria-label={`Preview ${photo.name}`}
        onMouseEnter={e => hover.show(e.currentTarget)} onMouseLeave={hover.hide}
        onFocus={e => hover.show(e.currentTarget)} onBlur={hover.hide}
        onClick={() => setPreviewId(photo.id)}><img src={photo.url} alt={photo.name} className="h-full w-full rounded-md object-cover shadow-sm transition-transform duration-200 ease-out hover:scale-[1.15] hover:shadow-lg" /></Button>
      <div className="mt-1 flex items-center justify-between">
        <Button variant="ghost" size="sm" className="h-7 px-1 text-xs" aria-label={`Make ${photo.name} main photograph`} aria-pressed={main?.id === photo.id} title="Choose main photograph" onClick={() => onChange({ photos, mainPhotoId: photo.id })}><Star className="h-3 w-3" />{main?.id === photo.id ? "Main" : ""}</Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" aria-label={`Remove ${photo.name}`} title="Remove photograph" onClick={() => onChange(removeUnitPhoto(unit, photo.id))}><Trash2 className="h-3 w-3" /></Button>
      </div>
    </li>)}</ul>}
    {photos.length > 0 && <p className="mt-1 text-[10px] text-muted-foreground">Kept for this prototype session only.</p>}
    {error && <p role="alert" className="mt-1 text-xs text-destructive">{error}</p>}
    {hover.rect && hovered && <FloatingPreview rect={hover.rect} url={hovered.url} alt={`${hovered.name} enlarged`} />}
    <Dialog open={Boolean(preview)} onOpenChange={open => { if (!open) setPreviewId(null); }}><DialogContent className="max-w-3xl"><DialogTitle>{preview?.name ?? "Photograph"}</DialogTitle>{preview && <img src={preview.url} alt={preview.name} className="max-h-[70vh] w-full object-contain" />}</DialogContent></Dialog>
  </section>;
}
