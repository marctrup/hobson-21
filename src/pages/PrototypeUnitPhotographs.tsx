import { useRef, useState } from "react";
import { ImagePlus, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { mainUnitPhoto, removeUnitPhoto, type UnitPhoto, type UnitPhotographs } from "./prototypeUnitPhotos";

type Props = { unit: UnitPhotographs & { name: string }; onChange: (photos: UnitPhotographs) => void };

export function UnitPhotoThumbnail({ unit }: { unit: UnitPhotographs & { name: string } }) {
  const photo = mainUnitPhoto(unit);
  return photo ? <img src={photo.url} alt={`${unit.name} main photograph`} className="mr-2 h-10 w-10 shrink-0 rounded object-cover" /> : null;
}

export function PrototypeUnitPhotographs({ unit, onChange }: Props) {
  const picker = useRef<HTMLInputElement>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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

  return <section aria-label={`${unit.name} photographs`} className="mt-3 border-y border-border py-2"
    onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)}
    onDrop={e => { e.preventDefault(); setDragging(false); void take(e.dataTransfer.files); }}>
    <div className={`flex flex-wrap items-center justify-between gap-2 ${dragging ? "bg-secondary" : ""}`}>
      <span className="text-xs font-medium text-muted-foreground">Photographs</span>
      <Button variant="ghost" size="sm" disabled={loading} onClick={() => picker.current?.click()}><ImagePlus className="h-4 w-4" />{loading ? "Opening photographs…" : photos.length ? "Add more photographs" : "Add photographs"}</Button>
      <input ref={picker} type="file" accept="image/*" multiple aria-label={`Choose photographs for ${unit.name}`} className="hidden" onChange={e => { if (e.target.files) void take(e.target.files); e.target.value = ""; }} />
    </div>
    {photos.length > 0 && <ul className="mt-2 flex flex-wrap gap-3">{photos.map(photo => <li key={photo.id} className="w-24">
      <Button variant="ghost" className="h-20 w-24 overflow-hidden p-0" aria-label={`Preview ${photo.name}`} onClick={() => setPreviewId(photo.id)}><img src={photo.url} alt={photo.name} className="h-full w-full object-cover" /></Button>
      <div className="mt-1 flex items-center justify-between">
        <Button variant="ghost" size="sm" className="h-7 px-1 text-xs" aria-label={`Make ${photo.name} main photograph`} aria-pressed={main?.id === photo.id} title="Choose main photograph" onClick={() => onChange({ photos, mainPhotoId: photo.id })}><Star className="h-3 w-3" />{main?.id === photo.id ? "Main" : ""}</Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" aria-label={`Remove ${photo.name}`} title="Remove photograph" onClick={() => onChange(removeUnitPhoto(unit, photo.id))}><Trash2 className="h-3 w-3" /></Button>
      </div>
    </li>)}</ul>}
    {photos.length > 0 && <p className="mt-1 text-[10px] text-muted-foreground">Kept for this prototype session only.</p>}
    {error && <p role="alert" className="mt-1 text-xs text-destructive">{error}</p>}
    <Dialog open={Boolean(preview)} onOpenChange={open => { if (!open) setPreviewId(null); }}><DialogContent className="max-w-3xl"><DialogTitle>{preview?.name ?? "Photograph"}</DialogTitle>{preview && <img src={preview.url} alt={preview.name} className="max-h-[70vh] w-full object-contain" />}</DialogContent></Dialog>
  </section>;
}