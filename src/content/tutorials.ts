export type Tutorial = {
  id: string;
  title: string;
  description: string;
  context: string;
  youtubeId?: string;
  relatedId?: string;
};

export const tutorials: Tutorial[] = [
  {
    id: 'paper-summary',
    title: 'See my summary of a paper',
    description: 'Select the small “i” beside a paper to see the summary I created when I read it.',
    context: 'Papers',
    youtubeId: 'pJ3N_u4t0Gc',
    relatedId: 'answer-source',
  },
  {
    id: 'answer-source',
    title: 'See where an answer came from',
    description: 'Open the citation in my answer to see the supporting paper and the relevant passage.',
    context: 'Conversation · Papers',
    relatedId: 'paper-summary',
  },
  {
    id: 'papers-and-map',
    title: 'Move between Papers and the Map',
    description: 'Move between the Map and Papers without losing where you were working.',
    context: 'Map · Papers',
    relatedId: 'unit-group-units',
  },
  {
    id: 'unit-group-units',
    title: 'Move between a unit group and its units',
    description: 'Move from a unit group into an individual unit and Hobson keeps the view centred on where you are working.',
    context: 'Map',
    relatedId: 'papers-and-map',
  },
  {
    id: 'little-context',
    title: 'Give me a little context',
    description: 'Mention the unit, tenancy or issue you mean and I can get to the right answer more directly.',
    context: 'Conversation',
    relatedId: 'answer-source',
  },
];
