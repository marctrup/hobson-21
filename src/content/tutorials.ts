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
    description: 'Select the small “i” to see the summary I created when I read the paper.',
    context: 'Papers',
    relatedId: 'answer-source',
  },
  {
    id: 'answer-source',
    title: 'See where my answer came from',
    description: 'Open a citation to see the paper and passage behind my answer.',
    context: 'Conversation · Papers',
    relatedId: 'keep-your-place',
  },
  {
    id: 'keep-your-place',
    title: 'Move around without losing your place',
    description: 'Move between the map and your papers while keeping the part of the portfolio you were working on.',
    context: 'Map · Papers',
    relatedId: 'paper-summary',
  },
];