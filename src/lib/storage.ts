import type { Hypothesis } from './types';

const STORAGE_KEY = 'bayes-hypotheses';

export function saveHypotheses(hypotheses: Hypothesis[]): void {
  console.log('Saving hypotheses:', hypotheses);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(hypotheses));
    // Verify save worked
    const saved = localStorage.getItem(STORAGE_KEY);
    console.log('Saved data:', saved);
  } catch (error) {
    console.error('Error saving hypotheses:', error);
  }
}

export function loadHypotheses(): Hypothesis[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    console.log('Loading hypotheses, raw data:', stored);
    const hypotheses = stored ? JSON.parse(stored) : [];
    console.log('Parsed hypotheses:', hypotheses);
    return hypotheses;
  } catch (error) {
    console.error('Error loading hypotheses:', error);
    return [];
  }
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
