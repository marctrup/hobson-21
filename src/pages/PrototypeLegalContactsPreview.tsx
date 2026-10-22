import { GroupLabel, RecordRow } from "./PrototypeRecordsShell";
import { contractorById, INITIAL_CONTACTS, preferredAt, unitPreferences, type ContactsState, type Contractor } from "./prototypeContactsRecords";
import { type PlaceContext } from "./prototypeRecordsPlace";

// Read-only preferred-contractor preview used by /prototype-legal. Independent of /prototype-contacts.

const contact = (c: Contractor) => `Telephone: ${c.phone ?? "Not recorded"} · Email: ${c.email ?? "Not recorded"}`;

export function ContactsContent({ state, place }: { state: ContactsState; place: PlaceContext }) {
  if (place === null) {
    const group = state.preferences.filter(p => p.scope.kind === "group");
    const shared = state.preferences.filter(p => p.scope.kind === "shared-areas");
    const units = state.preferences.filter(p => p.scope.kind === "unit");
    return (
      <div>
        <GroupLabel>Unit Group defaults</GroupLabel>
        {group.length ? <ul className="flex flex-col gap-2">{group.map(p => { const c = contractorById(state, p.contractorId); return <RecordRow key={p.id} title={`${p.service} — ${c.name}`} tag="Unit Group default" lines={["Preferred for The Paragon Centre and its Units", contact(c)]} />; })}</ul> : <p className="text-xs text-muted-foreground">None recorded.</p>}
        {shared.length > 0 && <><GroupLabel>Shared areas only</GroupLabel><ul className="flex flex-col gap-2">{shared.map(p => { const c = contractorById(state, p.contractorId); return <RecordRow key={p.id} title={`${p.service} — ${c.name}`} tag="Shared areas" lines={["Not used as the preference for individual Units", contact(c)]} />; })}</ul></>}
        {units.length > 0 && <><GroupLabel>Unit-specific preferences</GroupLabel><ul className="flex flex-col gap-2">{units.map(p => { const c = contractorById(state, p.contractorId); return <RecordRow key={p.id} title={`${p.service} — ${c.name}`} tag="Unit-specific" lines={[`Preferred for ${p.scope.kind === "unit" ? (p.scope.unit === 1 ? "First Floor Gym" : "Second Floor Flat") : ""} only`, contact(c)]} />; })}</ul></>}
        <GroupLabel>Contractors in my records</GroupLabel>
        <ul className="flex flex-col gap-2">{state.contractors.map(c => <RecordRow key={c.id} title={c.name} tag={c.trade} lines={[contact(c), `Preferred at: ${preferredAt(state, c.id).join("; ") || "nowhere at present"}`]} />)}</ul>
      </div>
    );
  }
  const prefs = unitPreferences(state, place);
  return prefs.length ? (
    <ul className="flex flex-col gap-2">{prefs.map(p => <RecordRow key={p.service} title={`${p.service} — ${p.contractor?.name ?? "No preferred contractor"}`} tag={p.origin} lines={[p.contractor ? contact(p.contractor) : "The Unit Group default isn't used for this Unit."]} />)}</ul>
  ) : <p className="text-xs text-muted-foreground">No preferred contractors recorded.</p>;
}

/** Read-only preview used by /prototype-legal; it never shares state with /prototype-contacts. */
export function ContactsPreview({ place }: { place: PlaceContext }) {
  return <ContactsContent state={INITIAL_CONTACTS} place={place} />;
}

