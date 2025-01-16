import type { Hypothesis, Observation } from './types';

export function calculatePosteriorProbability(hypothesis: Hypothesis): number {
  let probability = hypothesis.priorProbability;

  for (const observation of hypothesis.observations) {
    // Using Bayes' theorem
    const pH = probability; // P(H) - Prior probability
    const pEH = observation.probabilityGivenTrue; // P(E|H)
    const pENotH = observation.probabilityGivenFalse; // P(E|¬H)
    
    // P(H|E) = P(E|H)P(H) / (P(E|H)P(H) + P(E|¬H)P(¬H))
    const numerator = pEH * pH;
    const denominator = (pEH * pH) + (pENotH * (1 - pH));
    
    probability = numerator / denominator;
  }

  return probability;
}
