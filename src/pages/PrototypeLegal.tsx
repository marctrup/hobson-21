import { AboutContent, GroupLabel, PrototypeRecordsShell, RecordRow, useSessionState, type Turn } from "./PrototypeRecordsShell";
import { applyLegal, groupRecords, INITIAL_LEGAL, interpretLegal, recordedForUnit, scopeLabel, sharedWithUnit, unitScopedRecords, type LegalState, type Responsibility } from "./prototypeLegalRecords";
import { PLACE, unitName, type PlaceContext } from "./prototypeRecordsPlace";
import { ContactsPreview } from "./PrototypeContacts";

const SUGGESTIONS = [
  "Record that we need to establish who is responsible for the shared roof at The Paragon Centre.",
  "Record an electrical safety responsibility for both Units, but we haven't established who is responsible yet.",
  "Actually, that responsibility only concerns Second Floor Flat.",
];

function Row({ r }: { r: Responsibility }) {
  return <RecordRow title={r.name} tag={r.source} lines={[`${scopeLabel(r.scope)} · ${r.applicability}`, r.party ? `Responsible: ${r.party}` : "Responsible party not confirmed", r.notes]} />;
}

export function LegalContent({ state, place }: { state: LegalState; place: PlaceContext }) {
  if (place === null) {
    const units = unitScopedRecords(state);
    return (
      <div>
        <GroupLabel>Recorded at Unit Group level</GroupLabel>
        <ul className="flex flex-col gap-2">{groupRecords(state).map(r => <Row key={r.id} r={r} />)}</ul>
        {units.length > 0 && <><GroupLabel>Concerning selected Units</GroupLabel><ul className="flex flex-col gap-2">{units.map(r => <Row key={r.id} r={r} />)}</ul></>}
        <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">Hypothetical records of matters to consider — not verified obligations for this building.</p>
      </div>
    );
  }
  const own = recordedForUnit(state, place);
  const shared = sharedWithUnit(state, place);
  return (
    <div>
      <GroupLabel>Recorded for this Unit</GroupLabel>
      {own.length ? <ul className="flex flex-col gap-2">{own.map(r => <Row key={r.id} r={r} />)}</ul> : <p className="text-xs text-muted-foreground">No Unit-specific responsibility has been established.</p>}
      {shared.length > 0 && <><GroupLabel>Shared with selected Units</GroupLabel><ul className="flex flex-col gap-2">{shared.map(r => <Row key={r.id} r={r} />)}</ul></>}
      <GroupLabel>Recorded at {PLACE.name}</GroupLabel>
      <ul className="flex flex-col gap-2">{groupRecords(state).map(r => <Row key={r.id} r={r} />)}</ul>
      <p className="mt-2 text-[11px] text-muted-foreground">Unit Group records are not assumed to apply to {unitName(place)}.</p>
    </div>
  );
}

export default function PrototypeLegal() {
  const [state, setState] = useSessionState<LegalState>("hobson_prototype_legal_state", INITIAL_LEGAL);

  const respond = (text: string, place: PlaceContext): Turn => {
    const reply = interpretLegal(state, text, place);
    if (!reply.action || !reply.confirm) return { text: reply.text };
    const action = reply.action;
    return {
      text: reply.text,
      choices: [
        { label: reply.confirm[0], onPick: () => { setState(s => applyLegal(s, action)); return { text: action.kind === "add" ? "Recorded. You'll see it on the Map now." : "Changed. The record now shows only where it applies." }; } },
        { label: reply.confirm[1], onPick: () => ({ text: "Very well — nothing has changed." }) },
      ],
    };
  };

  return (
    <PrototypeRecordsShell
      focus="legal"
      opening="This is The Paragon Centre. Select it on the Map to see the legal responsibilities I hold for it and its Units. Tell me what to record and I'll keep it against the right place."
      suggestions={SUGGESTIONS}
      respond={respond}
      onReset={() => setState(INITIAL_LEGAL)}
      sectionCount={(key, place) => key === "legal" ? (place === null ? state.records.length : recordedForUnit(state, place).length + sharedWithUnit(state, place).length) : undefined}
      renderSection={(key, place) => key === "about" ? <AboutContent place={place} /> : key === "legal" ? <LegalContent state={state} place={place} /> : <ContactsPreview place={place} />}
    />
  );
}
