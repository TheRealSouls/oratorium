import { ArenaRouteLink } from "../../components/layout/ArenaRouteLink";
import { exampleProfile } from "../../lib/profile/exampleProfile";

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-[#0B0506] px-4 py-6 text-[#FFF7F8] sm:px-6 lg:px-8">
      <section className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-3 border-b border-[#3A151B] pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-sm font-medium text-[#FFB000]">Speaker profile</div>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal sm:text-4xl">{exampleProfile.displayName}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#D9A7AF]">
              Mock stats for the MVP shell. Firebase Auth and Firestore can replace this data without changing the page shape.
            </p>
          </div>
          <ArenaRouteLink
            href="/practice"
            className="w-full rounded-md bg-[#FF1E3C] px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[#FF5A6E] sm:w-auto"
          >
            Train again
          </ArenaRouteLink>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <section className="rounded-lg border border-[#3A151B] bg-[#18090B] p-5">
            <div className="text-sm text-[#D9A7AF]">ELO</div>
            <div className="mt-2 text-4xl font-semibold tabular-nums">{exampleProfile.elo}</div>
            <div className="mt-1 text-sm text-[#FFB000]">{exampleProfile.rank}</div>
          </section>
          <section className="rounded-lg border border-[#3A151B] bg-[#18090B] p-5">
            <div className="text-sm text-[#D9A7AF]">Recent change</div>
            <div className="mt-2 text-4xl font-semibold tabular-nums text-[#FFB000]">
              +{exampleProfile.recentEloChange}
            </div>
            <div className="mt-1 text-sm text-[#D9A7AF]">Last ranked round</div>
          </section>
          <section className="rounded-lg border border-[#3A151B] bg-[#18090B] p-5">
            <div className="text-sm text-[#D9A7AF]">Speeches</div>
            <div className="mt-2 text-4xl font-semibold tabular-nums">{exampleProfile.attemptCount}</div>
            <div className="mt-1 text-sm text-[#D9A7AF]">Completed attempts</div>
          </section>
          <section className="rounded-lg border border-[#3A151B] bg-[#18090B] p-5">
            <div className="text-sm text-[#D9A7AF]">Best score</div>
            <div className="mt-2 text-4xl font-semibold tabular-nums">{exampleProfile.bestScore}</div>
            <div className="mt-1 text-sm text-[#D9A7AF]">Best category: {exampleProfile.bestCategory}</div>
          </section>
        </div>

        <section className="mt-4 rounded-lg border border-[#3A151B] bg-[#18090B] p-5">
          <h2 className="text-lg font-semibold">Progress snapshot</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-md border border-[#4A1B22] bg-[#0B0506] p-4">
              <div className="text-sm text-[#D9A7AF]">Average score</div>
              <div className="mt-1 text-2xl font-semibold tabular-nums">{exampleProfile.averageScore}/100</div>
            </div>
            <div className="rounded-md border border-[#4A1B22] bg-[#0B0506] p-4">
              <div className="text-sm text-[#D9A7AF]">Leaderboard position</div>
              <div className="mt-1 text-2xl font-semibold tabular-nums">
                Top {exampleProfile.leaderboardPercentile}%
              </div>
            </div>
            <div className="rounded-md border border-[#4A1B22] bg-[#0B0506] p-4">
              <div className="text-sm text-[#D9A7AF]">Next target</div>
              <div className="mt-1 text-2xl font-semibold">Gold at 1100</div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
