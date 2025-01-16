import type { Hypothesis } from './types';

const STORAGE_KEY = 'bayes-hypotheses';

export function saveHypotheses(hypotheses: Hypothesis[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(hypotheses));
}

export function loadHypotheses(): Hypothesis[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function deleteHypothesis(id: string): void {
  const hypotheses = loadHypotheses();
  const updatedHypotheses = hypotheses.filter(h => h.id !== id);
  saveHypotheses(updatedHypotheses);
}

export function duplicateHypothesis(id: string): string {
  const hypotheses = loadHypotheses();
  const original = hypotheses.find(h => h.id === id);
  if (!original) return '';
  
  const duplicate: Hypothesis = {
    ...original,
    id: crypto.randomUUID(),
    name: `${original.name} (copy)`,
    observations: original.observations.map(obs => ({
      ...obs,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    })),
    createdAt: Date.now(),
    updatedAt: Date.now(),
    tags: original.tags || [] // Ensure tags are initialized
  };
  
  const updatedHypotheses = [...hypotheses, duplicate];
  saveHypotheses(updatedHypotheses);
  return duplicate.id;
}
