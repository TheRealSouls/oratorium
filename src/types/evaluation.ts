import type { ScoreKey, Scores } from "../lib/scoring/calculateScores";

export interface AttemptFlags {
  tooShort: boolean;
  offTopic: boolean;
  emptyTranscript: boolean;
  possiblePromptInjection: boolean;
  harmfulContent: boolean;
  lowConfidenceTranscript: boolean;
}

export interface EvaluationResponse {
  rawScores: Scores;
  categoryFeedback: Record<ScoreKey, string>;
  strengths: string[];
  improvements: string[];
  nextDrill: string;
  summaryFeedback: string;
  eloPerformanceEstimate: number;
  flags: AttemptFlags;
}
