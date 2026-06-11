import { ArenaLoading } from "../../components/ui/ArenaLoading";

export default function LeaderboardLoading() {
  return (
    <main className="min-h-screen bg-[#0B0506] px-4 py-10 text-[#FFF7F8]">
      <ArenaLoading
        label="Rankings"
        title="Opening the ranks"
        message="Loading ratings, filters, and arena standings..."
      />
    </main>
  );
}
