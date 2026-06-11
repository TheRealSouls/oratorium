import type { RankTitle } from "../lib/scoring/calculateElo";
import type { DurationSeconds, TopicCategory } from "./topic";

export type LeaderboardPeriod = "all-time" | "weekly";
export type LeaderboardCategoryFilter = "all" | TopicCategory;
export type LeaderboardDurationFilter = "all" | DurationSeconds;

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  photoURL?: string;
  elo: number;
  rank: RankTitle;
  recentEloChange: number;
  speechesCompleted: number;
  averageScore: number;
  bestScore: number;
  bestCategory: TopicCategory;
  percentile?: number;
  weeklyElo?: number;
  weeklyRecentEloChange?: number;
  weeklySpeechesCompleted?: number;
  categoryScores: Partial<Record<TopicCategory, number>>;
  durationScores: Partial<Record<DurationSeconds, number>>;
  updatedAt: string;
}
