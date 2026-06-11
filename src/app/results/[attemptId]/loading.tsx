import { ArenaLoading } from "../../../components/ui/ArenaLoading";

export default function ResultLoading() {
  return (
    <main className="min-h-screen bg-[#0B0506] px-4 py-10 text-[#FFF7F8]">
      <ArenaLoading
        label="Arena feedback"
        title="Opening your scorecard"
        message="Pulling your scorecard from the judging desk..."
      />
    </main>
  );
}
