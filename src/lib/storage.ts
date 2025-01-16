import type { Hypothesis } from './types';

const STORAGE_KEY = 'bayes-hypotheses';

export function saveHypotheses(hypotheses: Hypothesis[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(hypotheses));
}

export function loadHypotheses(): Hypothesis[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}
