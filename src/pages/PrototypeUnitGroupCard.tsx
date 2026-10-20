import { useEffect, useRef, useState } from "react";
import { Check, ImagePlus, Pencil } from "lucide-react";

// The Unit Group's own card details. The photograph belongs to the group only, never to its Units.
export type GroupPhoto = { url: string; x: number; y: number; zoom: number };
export type GroupCard = { name: string; description?: string; photo?: GroupPhoto };

type Props = {
  card: GroupCard;
  address: string;
  summary: string;
  label: string;
  onChange: (card: GroupCard) => void;
  onChangeAddress?: () => void;
  actions?: React.ReactNode;
};

const textBtn = "min-h-8 rounded-md px-2 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function PrototypeUnitGroupCard({ card, address, summary, label, onChange, onChangeAddress, actions }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [adjusting, setAdjusting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(card.name);
  const [description, setDescription] = useState(card.description ?? "");
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  useEffect(() => { if (!editing) { setName(card.name); setDescription(card.description ?? ""); } }, [card.name, card.description, editing]);

  // Real device file selection; the image lives only in this browser session.
  const take = (file?: File | null) => {
    if (!file || !file.type.startsWith("image/")) return;
    onChange({ ...card, photo: { url: URL.createObjectURL(file), x: 50, y: 50, zoom: 1 } });
    setAdjusting(true);
  };
  const photo = card.photo;
  const setPhoto = (p: Partial<GroupPhoto>) => photo && onChange({ ...card, photo: { ...photo, ...p } });
  const save = () => { const n = name.trim(); if (!n) return; onChange({ ...card, name: n, description: description.trim() || undefined }); setEditing(false); };

  return (
    <div className="min-w-0">
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); take(e.dataTransfer.files?.[0]); }}
        className={`relative mb-3 h-36 overflow-hidden rounded-md border ${dragOver ? "border-ring bg-secondary/50" : photo ? "border-border" : "border-dashed border-border bg-secondary/20"}`}
      >
        <input ref={fileRef} type="file" accept="image/*" className="hidden" aria-label="Choose a photograph" onChange={e => { take(e.target.files?.[0]); e.target.value = ""; }} />
        {photo ? <>
          <img
            src={photo.url} alt={`${card.name} cover photograph`} draggable={false}
            onPointerDown={e => { if (!adjusting) return; (e.target as HTMLElement).setPointerCapture(e.pointerId); drag.current = { x: e.clientX, y: e.clientY, px: photo.x, py: photo.y }; }}
            onPointerMove={e => { const d = drag.current; if (!d) return; const r = e.currentTarget.getBoundingClientRect(); setPhoto({ x: Math.max(0, Math.min(100, d.px - ((e.clientX - d.x) / r.width) * 100)), y: Math.max(0, Math.min(100, d.py - ((e.clientY - d.y) / r.height) * 100)) }); }}
            onPointerUp={() => { drag.current = null; }}
            style={{ objectPosition: `${photo.x}% ${photo.y}%`, transform: `scale(${photo.zoom})`, transformOrigin: `${photo.x}% ${photo.y}%` }}
            className={`h-full w-full object-cover ${adjusting ? "cursor-move touch-none" : ""}`}
          />
          <div className="absolute inset-x-2 bottom-2 flex flex-wrap items-center justify-end gap-1">
            {adjusting ? <div className="flex items-center gap-2 rounded-md bg-background/95 px-2 py-1 text-xs text-foreground shadow-sm">
              <span className="text-muted-foreground">Drag to reposition</span>
              <label className="flex items-center gap-1">Zoom<input type="range" min={1} max={2.5} step={0.05} value={photo.zoom} onChange={e => setPhoto({ zoom: Number(e.target.value) })} aria-label="Zoom photograph" className="w-20" /></label>
              <button type="button" onClick={() => setAdjusting(false)} className="inline-flex min-h-7 items-center gap-1 rounded px-1.5 font-medium hover:bg-secondary"><Check className="h-3 w-3" aria-hidden />Done</button>
            </div> : <div className="flex gap-1 rounded-md bg-background/90 p-0.5 shadow-sm">
              <button type="button" onClick={() => setAdjusting(true)} className={textBtn}>Adjust</button>
              <button type="button" onClick={() => fileRef.current?.click()} className={textBtn}>Replace</button>
              <button type="button" onClick={() => onChange({ ...card, photo: undefined })} className={textBtn}>Remove</button>
            </div>}
          </div>
        </> : (
          <button type="button" onClick={() => fileRef.current?.click()} className="flex h-full w-full flex-col items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <ImagePlus className="h-5 w-5" aria-hidden />Add a photograph
            <span className="text-[10px]">or drop one here · kept for this session only</span>
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          {editing ? (
            <div className="mt-1 flex flex-col gap-2">
              <label className="text-xs text-muted-foreground">Name
                <input value={name} autoFocus onChange={e => setName(e.target.value)} onKeyDown={e => { if (e.key === "Enter") save(); if (e.key === "Escape") setEditing(false); }} className="mt-0.5 h-9 w-full rounded-md border border-input bg-background px-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              </label>
              <label className="text-xs text-muted-foreground">Description <span className="font-normal">(optional)</span>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} placeholder="A short description of the building" className="mt-0.5 w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              </label>
              <div className="text-xs text-muted-foreground">Address
                <p className="mt-0.5 text-sm text-foreground">{address}</p>
                {onChangeAddress && <button type="button" onClick={() => { setEditing(false); onChangeAddress(); }} className="mt-0.5 text-xs underline-offset-4 hover:text-foreground hover:underline">Change the address with Hobson</button>}
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={save} disabled={!name.trim()} className="inline-flex min-h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground disabled:opacity-40"><Check className="h-3.5 w-3.5" aria-hidden />Save</button>
                <button type="button" onClick={() => setEditing(false)} className="min-h-9 rounded-md px-3 text-sm text-foreground hover:bg-secondary">Cancel</button>
              </div>
            </div>
          ) : <>
            <div className="mt-1 flex items-center gap-1">
              <h3 className="truncate text-xl font-semibold text-foreground">{card.name}</h3>
              <button type="button" aria-label={`Edit ${card.name}`} onClick={() => setEditing(true)} className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><Pencil className="h-3.5 w-3.5" aria-hidden /></button>
            </div>
            <p className="text-xs text-muted-foreground">{address}</p>
            {card.description && <p className="mt-1.5 text-sm text-foreground">{card.description}</p>}
            <p className="mt-1.5 text-sm text-foreground">{summary}</p>
          </>}
        </div>
        {actions && !editing && <div className="flex items-center gap-1">{actions}</div>}
      </div>
    </div>
  );
}
