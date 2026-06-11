import { LeaderboardScreen } from "../../components/leaderboard/LeaderboardScreen";
import { exampleLeaderboard } from "../../lib/leaderboard/exampleLeaderboard";

export default function LeaderboardPage() {
  return <LeaderboardScreen entries={exampleLeaderboard} currentUserId="user-5" />;
}
