import { ArenaLoading } from "../../components/ui/ArenaLoading";

export default function PracticeLoading() {
  return (
    <main className="min-h-screen bg-[#0B0506] px-4 py-10 text-[#FFF7F8]">
      <ArenaLoading
        label="Practice arena"
        title="Entering the arena"
        message="Loading your topic wheel, timer, and recording setup..."
      />
    </main>
  );
}
