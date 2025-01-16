import { error } from '@sveltejs/kit';
import { loadHypotheses } from '$lib/storage';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
  const hypotheses = loadHypotheses();
  const hypothesis = hypotheses.find(h => h.id === params.id);
  
  if (!hypothesis) {
    throw error(404, 'Hypothesis not found');
  }

  return {
    hypothesis
  };
};
