import { AboutContent, GroupLabel, PrototypeRecordsShell, RecordRow, useSessionState, type Choice, type Turn } from "./PrototypeRecordsShell";
import { applyContacts, contractorById, INITIAL_CONTACTS, interpretContacts, preferredAt, unitPreferences, type ContactsReply, type ContactsState, type Contractor } from "./prototypeContactsRecords";
import { type PlaceContext } from "./prototypeRecordsPlace";
import { LegalContent } from "./PrototypeLegal";
import { INITIAL_LEGAL } from "./prototypeLegalRecords";

const SUGGESTIONS = [
  "ABC Plumbing are our preferred plumbers for The Paragon Centre.",
  "For plumbing at Second Floor Flat, use Flat Plumbing Services instead.",
  "Use ABC Plumbing for plumbing at First Floor Gym as well.",
  "ABC Plumbing's telephone number is 020 7946 0321.",
  "Don't use ABC Plumbing for First Floor Gym anymore.",
];

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

export default function PrototypeContacts() {
  const [state, setState] = useSessionState<ContactsState>("hobson_prototype_contacts_state", INITIAL_CONTACTS);

  const toTurn = (reply: ContactsReply): Turn => {
    const done: Turn = { text: "Recorded. You'll see it on the Map now." };
    const choices: Choice[] = [];
    if (reply.action && reply.confirm) {
      const action = reply.action;
      choices.push({ label: reply.confirm[0], onPick: () => { setState(s => applyContacts(s, action)); return done; } });
      choices.push({ label: reply.confirm[1], onPick: () => ({ text: "Very well — nothing has changed." }) });
    }
    for (const c of reply.choices ?? []) {
      choices.push({ label: c.label, primary: false, onPick: () => {
        if (c.next) return toTurn(c.next);
        if (c.action) { const a = c.action; setState(s => applyContacts(s, a)); return done; }
        return { text: "Very well — nothing has changed." };
      } });
    }
    return { text: reply.text, choices: choices.length ? choices : undefined };
  };

  return (
    <PrototypeRecordsShell
      focus="contacts"
      opening="This is The Paragon Centre. Select it on the Map to see the contractors you prefer there and at each Unit. Tell me who you'd like to use and I'll record it against the right place."
      suggestions={SUGGESTIONS}
      respond={(text, place) => toTurn(interpretContacts(state, text, place))}
      onReset={() => setState(INITIAL_CONTACTS)}
      sectionCount={(key, place) => key === "contacts" ? (place === null ? state.preferences.length : unitPreferences(state, place).filter(p => p.contractor).length) : undefined}
      renderSection={(key, place) => key === "about" ? <AboutContent place={place} /> : key === "contacts" ? <ContactsContent state={state} place={place} /> : <LegalContent state={INITIAL_LEGAL} place={place} />}
    />
  );
}
