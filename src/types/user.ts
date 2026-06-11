import type { RankTitle } from "../lib/scoring/calculateElo";
import type { TopicCategory } from "./topic";

export interface UserProfile {
  id: string;
  displayName: string;
  elo: number;
  rank: RankTitle;
  attemptCount: number;
  averageScore: number;
  bestScore: number;
  bestCategory: TopicCategory;
  recentEloChange: number;
  leaderboardPercentile?: number;
}
