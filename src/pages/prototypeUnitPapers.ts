// Illustrative papers already read by Hobson, and the Units each is CONFIRMED to apply to.
// A matching name or address never establishes a link: only entries in `confirmedFor` count.
export type UnitPaper = {
  id: string;
  kind: string;
  dated: string;
  title: string;
  excerpt: string;
  // Physical / functional description only — no rent, term, reviews or parties.
  premises: string;
  confirmedFor: { groupId: string; unit: number; individual: boolean }[];
};

export const PARAGON_GROUP_ID = "demo-paragon-centre";

export const UNIT_PAPERS: UnitPaper[] = [
  {
    id: "paragon-gym-lease-2005",
    kind: "Business Lease",
    dated: "29 November 2005",
    title: "Business Lease — 1st Floor Gym, The Paragon Centre",
    excerpt: "Section 2 Grant of Lease / Section 1 Definitions: This is a Right to Occupy / Business Lease for the premises known as the 1st Floor Gym at The Paragon Centre, 3 Reading Lane, London E8 1GQ. The lease is dated 29 November 2005, with a term of twenty-five years commencing on 1 December 2005 and rent review dates on 1 December 2010, 2015, 2020 and 2025. The landlord is Rotch Property Group Limited and the tenant is Handhs Limited.",
    premises: "Identified in the lease as the 1st Floor Gym at The Paragon Centre, 3 Reading Lane, London E8 1GQ.",
    confirmedFor: [{ groupId: PARAGON_GROUP_ID, unit: 1, individual: true }],
  },
];

export type UnitKnowledge = { paper: UnitPaper; shared: boolean };

export function knowledgeFor(groupId: string | null | undefined, unit: number): UnitKnowledge[] {
  if (!groupId) return [];
  return UNIT_PAPERS.flatMap(paper => {
    const link = paper.confirmedFor.find(l => l.groupId === groupId && l.unit === unit);
    return link ? [{ paper, shared: !link.individual }] : [];
  });
}

export const paperById = (id: string) => UNIT_PAPERS.find(p => p.id === id) ?? null;
