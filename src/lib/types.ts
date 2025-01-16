export interface Hypothesis {
  id: string;
  name: string;
  description: string;
  priorProbability: number; // 0-1
  observations: Observation[];
}

export interface Observation {
  id: string;
  description: string;
  // P(E|H) - Probability of seeing this evidence given hypothesis is true
  probabilityGivenTrue: number;
  // P(E|¬H) - Probability of seeing this evidence given hypothesis is false
  probabilityGivenFalse: number;
  timestamp: number;
  notes?: string;
}
