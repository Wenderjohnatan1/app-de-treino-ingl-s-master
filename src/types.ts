/**
 * Types defining user, progress, statistics and study material for Inglês Master App
 */

export interface Phrase {
  id: number;
  english: string;
  translation: string;
  meaning: string;
  example: string;
  exampleTranslation: string;
  context: string;
  category: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface PhraseProgress {
  correct: number;
  incorrect: number;
  status: 'unreached' | 'reviewing' | 'learned';
  lastPracticedAt?: string;
  // SRS (Spaced Repetition System) properties
  srsInterval?: number;       // current interval in days
  srsEaseFactor?: number;     // ease factor (default 2.5)
  srsRepetitions?: number;    // number of consecutive correct reviews
  srsNextReviewDate?: string; // YYYY-MM-DD when this card is due
}

export interface UserProgressData {
  userId: string;
  correctCount: number;
  incorrectCount: number;
  streak: number;
  lastActiveDate?: string;
  phraseStats: Record<number, PhraseProgress>; // key is phrase.id
  incorrectPhraseIds: number[]; // currently active errors / to be reviewed
  history: DailyHistory[];
}

export interface DailyHistory {
  date: string; // YYYY-MM-DD
  correct: number;
  incorrect: number;
}

export type TrainingMode = 'falar' | 'ouvir' | 'escrever';
export type AppTab = 'dashboard' | 'treinar' | 'frases' | 'progresso' | 'memorizacao';
