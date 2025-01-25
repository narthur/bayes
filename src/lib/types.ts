export type Tag = {
  id: string;
  name: string;
  color: string;
};

export interface Hypothesis {
  id: string;
  name: string;
  description: string;
  priorProbability: number; // 0-1
  observations: Observation[];
  tags: Tag[];
  createdAt: number;
  updatedAt: number;
  beeminderGoal?: string;
  archived?: boolean;
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
  linkedHypotheses?: string[]; // IDs of linked hypotheses
}

export interface ProbabilityPoint {
  timestamp: number;
  probability: number;
  observationId: string;
}

export interface BeeminderConfig {
  username: string;
  authToken: string;
  hypothesisGoal?: string;
  observationGoal?: string;
}

export interface BeeminderGoal {
  slug: string;
  title: string;
}

export interface BeeminderDatapoint {
  value: number;
  timestamp?: number;
  comment?: string;
  requestid?: string;
}

export interface LessonProgress {
  id: string;
  completed: boolean;
  lastVisited: number;
}

export interface CourseProgress {
  currentLesson: string;
  completedLessons: LessonProgress[];
  lastVisited: number;
}
