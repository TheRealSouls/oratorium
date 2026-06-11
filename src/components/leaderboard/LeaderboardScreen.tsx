"use client";

import { useMemo, useState } from "react";
import type {
  LeaderboardCategoryFilter,
  LeaderboardDurationFilter,
  LeaderboardEntry,
  LeaderboardPeriod,
} from "../../types/leaderboard";
import type { DurationSeconds, TopicCategory } from "../../types/topic";
import { rankingTiers } from "../../lib/leaderboard/rankingTiers";
import { ArenaRouteLink } from "../layout/ArenaRouteLink";
import { RankBadge } from "./RankBadge";

interface LeaderboardScreenProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
}

const periods: { value: LeaderboardPeriod; label: string }[] = [
  { value: "all-time", label: "All time" },
  { value: "weekly", label: "Weekly" },
];

const categories: { value: LeaderboardCategoryFilter; label: string }[] = [
  { value: "all", label: "All categories" },
  { value: "general", label: "General" },
  { value: "irish", label: "Irish" },
  { value: "school", label: "School" },
  { value: "fun", label: "Fun" },
];

const durations: { value: LeaderboardDurationFilter; label: string }[] = [
  { value: "all", label: "All durations" },
  { value: 60, label: "1 minute" },
  { value: 120, label: "2 minutes" },
  { value: 300, label: "5 minutes" },
];

function signed(value: number) {
  return value > 0 ? `+${value}` : String(value);
}

function categoryScore(entry: LeaderboardEntry, category: TopicCategory) {
  return entry.categoryScores[category] ?? 0;
}

function durationScore(entry: LeaderboardEntry, duration: DurationSeconds) {
  return entry.durationScores[duration] ?? 0;
}

function filteredScore(
  entry: LeaderboardEntry,
  period: LeaderboardPeriod,
  category: LeaderboardCategoryFilter,
  duration: LeaderboardDurationFilter
) {
  if (category !== "all") return categoryScore(entry, category);
  if (duration !== "all") return durationScore(entry, duration);
  return period === "weekly" ? entry.weeklyElo ?? entry.elo : entry.elo;
}

function recentChange(entry: LeaderboardEntry, period: LeaderboardPeriod) {
  return period === "weekly" ? entry.weeklyRecentEloChange ?? 0 : entry.recentEloChange;
}

function speechCount(entry: LeaderboardEntry, period: LeaderboardPeriod) {
  return period === "weekly" ? entry.weeklySpeechesCompleted ?? 0 : entry.speechesCompleted;
}

function entryIsEligible(
  entry: LeaderboardEntry,
  period: LeaderboardPeriod,
  category: LeaderboardCategoryFilter,
  duration: LeaderboardDurationFilter
) {
  if (period === "weekly" && !entry.weeklySpeechesCompleted) return false;
  if (category !== "all" && !entry.categoryScores[category]) return false;
  if (duration !== "all" && !entry.durationScores[duration]) return false;
  return true;
}

export function LeaderboardScreen({ entries, currentUserId }: LeaderboardScreenProps) {
  const [period, setPeriod] = useState<LeaderboardPeriod>("all-time");
  const [category, setCategory] = useState<LeaderboardCategoryFilter>("all");
  const [duration, setDuration] = useState<LeaderboardDurationFilter>("all");

  const filteredEntries = useMemo(
    () =>
      entries
        .filter((entry) => entryIsEligible(entry, period, category, duration))
        .sort((first, second) => filteredScore(second, period, category, duration) - filteredScore(first, period, category, duration)),
    [category, duration, entries, period]
  );

  const currentUser = entries.find((entry) => entry.userId === currentUserId) ?? entries[entries.length - 1];

  return (
    <main className="min-h-screen bg-[#0B0506] px-4 py-6 text-[#FFF7F8] sm:px-6 lg:px-8">
      <section className="mx-auto max-w-6xl">
        <div className="border-b border-[#3A151B] pb-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="text-sm font-medium text-[#FFB000]">Competitive rankings</div>
              <h1 className="mt-2 text-3xl font-semibold tracking-normal sm:text-4xl">Leaderboard</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#D9A7AF]">
                Ratings reward relevant, complete speeches. New speakers move faster early, so the first few rounds matter.
              </p>
            </div>
            <ArenaRouteLink
              href="/practice"
              className="w-full rounded-md bg-[#FF1E3C] px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[#FF5A6E] sm:w-auto"
            >
              Start a round
            </ArenaRouteLink>
          </div>

          <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_220px_180px]">
            <div className="grid grid-cols-2 gap-2">
              {periods.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPeriod(option.value)}
                  className={[
                    "rounded-md border px-3 py-2 text-sm font-medium transition-colors",
                    period === option.value
                      ? "border-[#FF1E3C] bg-[#FF1E3C] text-white"
                      : "border-[#4A1B22] bg-[#18090B] text-[#D9A7AF] hover:border-[#FF5A6E] hover:text-white",
                  ].join(" ")}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <label className="grid gap-1 text-sm">
              <span className="text-[#D9A7AF]">Category</span>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value as LeaderboardCategoryFilter)}
                className="rounded-md border border-[#4A1B22] bg-[#18090B] px-3 py-2 text-[#FFF7F8]"
              >
                {categories.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-[#D9A7AF]">Duration</span>
              <select
                value={duration}
                onChange={(event) =>
                  setDuration(event.target.value === "all" ? "all" : (Number(event.target.value) as DurationSeconds))
                }
                className="rounded-md border border-[#4A1B22] bg-[#18090B] px-3 py-2 text-[#FFF7F8]"
              >
                {durations.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {currentUser && (
          <section className="mt-5 rounded-lg border border-[#3A151B] bg-[#18090B] p-5">
            <div className="grid gap-4 lg:grid-cols-[1fr_160px_160px_160px]">
              <div>
                <div className="text-sm text-[#FFB000]">Your arena position</div>
                <div className="mt-2">
                  <RankBadge rank={currentUser.rank} className="text-sm" />
                </div>
                <p className="mt-2 text-sm leading-6 text-[#D9A7AF]">
                  {currentUser.speechesCompleted < 5
                    ? "Placement is still forming. Early rounds have higher movement, so one strong speech can shift your rating."
                    : `You are ahead of ${currentUser.percentile ?? 50}% of ranked speakers.`}
                </p>
              </div>
              <div className="rounded-md border border-[#4A1B22] bg-[#0B0506] p-3">
                <div className="text-xs text-[#D9A7AF]">ELO</div>
                <div className="mt-1 text-3xl font-semibold tabular-nums">{currentUser.elo}</div>
              </div>
              <div className="rounded-md border border-[#4A1B22] bg-[#0B0506] p-3">
                <div className="text-xs text-[#D9A7AF]">Recent</div>
                <div className="mt-1 text-3xl font-semibold tabular-nums text-[#FFB000]">
                  {signed(recentChange(currentUser, period))}
                </div>
              </div>
              <div className="rounded-md border border-[#4A1B22] bg-[#0B0506] p-3">
                <div className="text-xs text-[#D9A7AF]">Speeches</div>
                <div className="mt-1 text-3xl font-semibold tabular-nums">{speechCount(currentUser, period)}</div>
              </div>
            </div>
          </section>
        )}

        <section className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px]">
          <div className="overflow-hidden rounded-lg border border-[#3A151B] bg-[#18090B]">
            {filteredEntries.length === 0 ? (
              <div className="p-8 text-center">
                <h2 className="text-xl font-semibold">No ranked speeches yet</h2>
                <p className="mt-2 text-sm text-[#D9A7AF]">
                  Be the first to post a verified result for this filter.
                </p>
                <ArenaRouteLink
                  href="/practice"
                  className="mt-5 inline-flex rounded-md bg-[#FF1E3C] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#FF5A6E]"
                >
                  Take the slot
                </ArenaRouteLink>
              </div>
            ) : (
              <div className="divide-y divide-[#3A151B]">
                {filteredEntries.map((entry, index) => (
                  <div
                    key={entry.userId}
                    className={[
                      "grid gap-3 p-4 sm:grid-cols-[56px_1fr_100px] sm:items-center lg:grid-cols-[64px_1fr_96px_96px_96px_110px]",
                      entry.userId === currentUserId ? "bg-[#240D10]" : "bg-[#18090B]",
                    ].join(" ")}
                  >
                    <div className="text-2xl font-semibold tabular-nums text-[#FFB000]">#{index + 1}</div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="font-semibold">{entry.displayName}</div>
                        <RankBadge rank={entry.rank} />
                      </div>
                      <div className="mt-1 text-sm text-[#D9A7AF]">
                        Best: {entry.bestCategory} / Avg {entry.averageScore} / Top {entry.percentile ?? 50}%
                        {category !== "all" || duration !== "all"
                          ? ` / Filter score ${filteredScore(entry, period, category, duration)}`
                          : ""}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-[#D9A7AF]">ELO</div>
                      <div className="font-semibold tabular-nums">{entry.elo}</div>
                    </div>
                    <div>
                      <div className="text-xs text-[#D9A7AF]">Recent</div>
                      <div className="font-semibold tabular-nums text-[#FFB000]">{signed(recentChange(entry, period))}</div>
                    </div>
                    <div>
                      <div className="text-xs text-[#D9A7AF]">Speeches</div>
                      <div className="font-semibold tabular-nums">{speechCount(entry, period)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-[#D9A7AF]">Best score</div>
                      <div className="font-semibold tabular-nums">{entry.bestScore}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <aside className="rounded-lg border border-[#3A151B] bg-[#18090B] p-5">
            <h2 className="text-lg font-semibold">Ranking tiers</h2>
            <div className="mt-4 grid gap-2">
              {rankingTiers.map((tier) => (
                <div key={tier.title} className="rounded-md border border-[#3A151B] bg-[#0B0506] p-3">
                  <div className="flex items-center justify-between gap-3">
                    <RankBadge rank={tier.title} />
                    <div className="text-xs tabular-nums text-[#D9A7AF]">
                      {tier.minElo}-{tier.maxElo}
                    </div>
                  </div>
                  <p className="mt-1 text-xs leading-5 text-[#D9A7AF]">{tier.copy}</p>
                </div>
              ))}
            </div>
          </aside>
        </section>
      </section>
    </main>
  );
}
