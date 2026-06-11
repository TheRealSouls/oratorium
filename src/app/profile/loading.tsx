import { ArenaLoading } from "../../components/ui/ArenaLoading";

export default function ProfileLoading() {
  return (
    <main className="min-h-screen bg-[#0B0506] px-4 py-10 text-[#FFF7F8]">
      <ArenaLoading
        label="Speaker profile"
        title="Loading your profile"
        message="Pulling your score history and rank snapshot..."
      />
    </main>
  );
}
