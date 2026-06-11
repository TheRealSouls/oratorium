import type { DurationSeconds, TopicDifficulty } from "../../types/topic";
import { clampScore } from "./calculateScores";

export type RankTitle =
  | "Novice"
  | "Bronze"
  | "Silver"
  | "Gold"
  | "Platinum"
  | "Diamond"
  | "Master"
  | "Grandmaster";

export interface EloInput {
  currentElo: number;
  overallScore: number;
  topicDifficulty: TopicDifficulty;
  durationSeconds: DurationSeconds;
  attemptCount: number;
  consistencyScore?: number;
}

export interface EloResult {
  eloBefore: number;
  eloAfter: number;
  change: number;
  expectedScore: number;
  kFactor: number;
  difficultyMultiplier: number;
  durationMultiplier: number;
  consistencyMultiplier: number;
  rankBefore: RankTitle;
  rankAfter: RankTitle;
}

export const STARTING_ELO = 800;
export const MIN_ELO = 200;
export const MAX_ELO = 2500;

export const DIFFICULTY_MULTIPLIERS: Record<TopicDifficulty, number> = {
  beginner: 0.9,
  intermediate: 1,
  advanced: 1.1,
};

export const DURATION_MULTIPLIERS: Record<DurationSeconds, number> = {
  60: 0.9,
  120: 1,
  300: 1.15,
};

export function clampElo(value: number) {
  if (!Number.isFinite(value)) return STARTING_ELO;
  return Math.max(MIN_ELO, Math.min(MAX_ELO, Math.round(value)));
}

export function expectedScoreForElo(elo: number) {
  const clampedElo = clampElo(elo);

  if (clampedElo < 500) return 35;
  if (clampedElo < 800) return 45;
  if (clampedElo < 1100) return 55;
  if (clampedElo < 1400) return 65;
  if (clampedElo < 1700) return 75;
  if (clampedElo < 2000) return 82;
  if (clampedElo < 2300) return 88;
  return 93;
}

export function getKFactor(attemptCount: number) {
  if (!Number.isFinite(attemptCount) || attemptCount < 5) return 90;
  if (attemptCount < 15) return 70;
  if (attemptCount < 30) return 50;
  return 35;
}

export function getRankTitle(elo: number): RankTitle {
  const clampedElo = clampElo(elo);

  if (clampedElo < 500) return "Novice";
  if (clampedElo < 800) return "Bronze";
  if (clampedElo < 1100) return "Silver";
  if (clampedElo < 1400) return "Gold";
  if (clampedElo < 1700) return "Platinum";
  if (clampedElo < 2000) return "Diamond";
  if (clampedElo < 2300) return "Master";
  return "Grandmaster";
}

export function getConsistencyMultiplier(consistencyScore?: number) {
  if (consistencyScore === undefined) return 1;

  const clampedConsistency = clampScore(consistencyScore);

  if (clampedConsistency >= 80) return 1.05;
  if (clampedConsistency >= 60) return 1;
  if (clampedConsistency >= 40) return 0.95;
  return 0.9;
}

export function calculateElo(input: EloInput): EloResult {
  const eloBefore = clampElo(input.currentElo);
  const overallScore = clampScore(input.overallScore);
  const expectedScore = expectedScoreForElo(eloBefore);
  const kFactor = getKFactor(input.attemptCount);
  const difficultyMultiplier = DIFFICULTY_MULTIPLIERS[input.topicDifficulty];
  const durationMultiplier = DURATION_MULTIPLIERS[input.durationSeconds];
  const consistencyMultiplier = getConsistencyMultiplier(input.consistencyScore);
  const change = Math.round(
    kFactor *
      difficultyMultiplier *
      durationMultiplier *
      consistencyMultiplier *
      ((overallScore - expectedScore) / 100)
  );
  const eloAfter = clampElo(eloBefore + change);

  return {
    eloBefore,
    eloAfter,
    change: eloAfter - eloBefore,
    expectedScore,
    kFactor,
    difficultyMultiplier,
    durationMultiplier,
    consistencyMultiplier,
    rankBefore: getRankTitle(eloBefore),
    rankAfter: getRankTitle(eloAfter),
  };
}
