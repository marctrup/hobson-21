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
    title: 'See my summary of a read paper',
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
    youtubeId: 'a47ImZr9Tss',
    relatedId: 'paper-summary',
  },
  {
    id: 'papers-and-map',
    title: 'Move between Papers and the Map',
    description: 'Move between the Map and Papers without losing where you were working.',
    context: 'Map · Papers',
    youtubeId: 'b2Jo9k6ifiY',
    relatedId: 'unit-group-units',
  },
  {
    id: 'unit-group-units',
    title: 'Move between a unit group and its units',
    description: 'Move from a unit group into an individual unit and Hobson keeps the view centred on where you are working.',
    context: 'Map',
    youtubeId: 'xAWnwhp1WXA',
    relatedId: 'papers-and-map',
  },
];
