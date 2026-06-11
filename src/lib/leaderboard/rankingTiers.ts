import type { RankTitle } from "../scoring/calculateElo";

export interface RankingTier {
  title: RankTitle;
  minElo: number;
  maxElo: number;
  copy: string;
}

export const rankingTiers: RankingTier[] = [
  { title: "Novice", minElo: 200, maxElo: 499, copy: "Learning the arena basics." },
  { title: "Bronze", minElo: 500, maxElo: 799, copy: "Building control and stamina." },
  { title: "Silver", minElo: 800, maxElo: 1099, copy: "A serious training base." },
  { title: "Gold", minElo: 1100, maxElo: 1399, copy: "Consistent, structured delivery." },
  { title: "Platinum", minElo: 1400, maxElo: 1699, copy: "Strong argument under pressure." },
  { title: "Diamond", minElo: 1700, maxElo: 1999, copy: "Commanding competitive speaker." },
  { title: "Master", minElo: 2000, maxElo: 2299, copy: "Elite clarity and persuasion." },
  { title: "Grandmaster", minElo: 2300, maxElo: 2500, copy: "Top-tier arena performer." },
];
