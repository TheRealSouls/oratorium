export type ScoreKey =
  | "relevance"
  | "clarity"
  | "structure"
  | "tone"
  | "confidence"
  | "pacing"
  | "evocativeness"
  | "argumentQuality"
  | "conclusion";

export type Scores = Record<ScoreKey, number>;

export type RawScoreInput = Partial<Record<ScoreKey, unknown>>;

export interface ScoreCalculation {
  uncappedScores: Scores;
  cappedScores: Scores;
  overallScore: number;
  capApplied: boolean;
}

export const SCORE_WEIGHTS: Record<ScoreKey, number> = {
  relevance: 0.25,
  clarity: 0.12,
  structure: 0.12,
  tone: 0.08,
  confidence: 0.08,
  pacing: 0.08,
  evocativeness: 0.08,
  argumentQuality: 0.14,
  conclusion: 0.05,
};

export const SCORE_LABELS: Record<ScoreKey, string> = {
  relevance: "Relevance",
  clarity: "Clarity",
  structure: "Structure",
  tone: "Tone",
  confidence: "Confidence",
  pacing: "Pacing",
  evocativeness: "Evocativeness",
  argumentQuality: "Argument quality",
  conclusion: "Conclusion",
};

export const SCORE_KEYS: ScoreKey[] = [
  "relevance",
  "clarity",
  "structure",
  "tone",
  "confidence",
  "pacing",
  "evocativeness",
  "argumentQuality",
  "conclusion",
];

export function clampScore(value: unknown) {
  if (typeof value !== "number" || !Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, value));
}

export function calculateScores(rawScores: RawScoreInput = {}): ScoreCalculation {
  const uncappedScores = SCORE_KEYS.reduce((scores, key) => {
    scores[key] = clampScore(rawScores[key]);
    return scores;
  }, {} as Scores);

  const relevance = uncappedScores.relevance;
  let capApplied = false;

  const cappedScores = SCORE_KEYS.reduce((scores, key) => {
    const cappedScore = key === "relevance" ? relevance : Math.min(uncappedScores[key], relevance);
    scores[key] = cappedScore;
    capApplied ||= cappedScore !== uncappedScores[key];
    return scores;
  }, {} as Scores);

  const overallScore = Math.round(
    SCORE_KEYS.reduce((total, key) => total + cappedScores[key] * SCORE_WEIGHTS[key], 0)
  );

  return {
    uncappedScores,
    cappedScores,
    overallScore,
    capApplied,
  };
}
