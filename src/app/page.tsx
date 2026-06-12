import Image from "next/image";
import stageSpotlight from "../media/stage_spotlight.png";
import { HowItWorksDemo } from "../components/landing/HowItWorksDemo";
import { TestimonialsMarquee } from "../components/landing/TestimonialsMarquee";
import { ArenaRouteLink } from "../components/layout/ArenaRouteLink";
import { RankBadge } from "../components/leaderboard/RankBadge";
import type { RankTitle } from "../lib/scoring/calculateElo";
import { SCORE_KEYS, SCORE_LABELS, SCORE_WEIGHTS } from "../lib/scoring/calculateScores";

const scoring = SCORE_KEYS.map((key) => [SCORE_LABELS[key], Math.round(SCORE_WEIGHTS[key] * 100)] as const);

const feedback = [
  "Three strengths you can repeat",
  "Three improvements to attack next",
  "One concrete speaking drill",
  "Category feedback with capped scores",
];

const ranks: [RankTitle, string][] = [
  ["Novice", "200"],
  ["Bronze", "500"],
  ["Silver", "800"],
  ["Gold", "1100"],
  ["Platinum", "1400"],
  ["Diamond", "1700"],
  ["Master", "2000"],
  ["Grandmaster", "2300"],
];

const leaderboard: [string, string, RankTitle, string][] = [
  ["1", "Aoife", "Master", "2074"],
  ["2", "Niamh", "Diamond", "1848"],
  ["3", "Daniel", "Platinum", "1536"],
  ["4", "You", "Silver", "812"],
];

export default function HomePage() {
  return (
    <main className="bg-arena-background text-arena-text">
      <section className="relative overflow-hidden border-b border-arena-border">
        <div className="absolute inset-0">
          <Image
            src={stageSpotlight}
            alt="Pixel art theatre stage lit by a bright spotlight"
            fill
            priority
            sizes="100vw"
            className="object-contain object-center opacity-95 sm:object-[78%_center] [image-rendering:pixelated]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#0B0506_0%,#0B0506_34%,rgba(11,5,6,0.82)_58%,rgba(11,5,6,0.34)_100%)]" />
          <div className="absolute inset-0 bg-[#3A0509]/20" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(0deg,#0B0506,rgba(11,5,6,0))]" />
        </div>

        <div className="relative mx-auto grid min-h-[calc(100vh-81px)] max-w-6xl content-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
          <div className="min-w-0 max-w-[calc(100vw-2rem)] sm:max-w-3xl">
            <h1 className="max-w-[12ch] text-4xl font-semibold leading-[1.04] tracking-normal text-white sm:max-w-3xl sm:text-7xl">
              Train your voice under pressure.
            </h1>
            <p className="mt-6 max-w-[calc(100vw-2rem)] text-lg leading-8 text-arena-textMuted sm:max-w-2xl">
              Oratorium turns public speaking practice into a competitive training loop: random topics, timed recordings,
              AI feedback, hard scoring, and a leaderboard worth chasing.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ArenaRouteLink
                href="/practice"
                className="w-full rounded-md bg-arena-red px-5 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-arena-redLight focus:outline-none focus:ring-2 focus:ring-arena-redLight focus:ring-offset-2 focus:ring-offset-arena-background sm:w-auto"
              >
                Enter practice
              </ArenaRouteLink>
              <ArenaRouteLink
                href="/leaderboard"
                className="w-full rounded-md border border-arena-redDark bg-arena-background/80 px-5 py-3 text-center text-sm font-semibold text-arena-text transition-colors hover:border-arena-redLight hover:bg-arena-surface focus:outline-none focus:ring-2 focus:ring-arena-redLight focus:ring-offset-2 focus:ring-offset-arena-background sm:w-auto"
              >
                View ranks
              </ArenaRouteLink>
            </div>
          </div>

          <div className="min-w-0 max-w-[calc(100vw-2rem)] self-end rounded-lg border border-arena-border bg-arena-background/85 p-4 sm:max-w-none">
            <div className="grid gap-3 text-center sm:grid-cols-3">
              <div className="rounded-md border border-arena-border bg-arena-surface p-3">
                <div className="text-2xl font-semibold text-white">100</div>
                <div className="mt-1 text-xs text-arena-textMuted">max score</div>
              </div>
              <div className="rounded-md border border-arena-border bg-arena-surface p-3">
                <div className="text-2xl font-semibold text-white">2500</div>
                <div className="mt-1 text-xs text-arena-textMuted">ELO ceiling</div>
              </div>
              <div className="rounded-md border border-arena-border bg-arena-surface p-3">
                <div className="text-2xl font-semibold text-white">400</div>
                <div className="mt-1 text-xs text-arena-textMuted">topics live</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <HowItWorksDemo />

      <section className="border-b border-arena-border bg-arena-surface">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">A score that refuses to flatter you.</h2>
            <p className="mt-4 text-base leading-7 text-arena-textMuted">
              Every speech is judged across delivery, argument, and structure. Relevance is the gate: if you dodge the
              topic, every other category is capped by that relevance score.
            </p>
            <div className="mt-6 rounded-lg border border-arena-border bg-arena-background p-4">
              <div className="text-sm font-semibold text-arena-gold">AI feedback</div>
              <p className="mt-3 text-2xl font-semibold leading-tight text-white">
                Strong opening. Your argument needs a cleaner turn before the conclusion.
              </p>
              <div className="mt-5 grid gap-2">
                {feedback.map((item) => (
                  <div
                    key={item}
                    className="rounded-md border border-arena-border bg-arena-elevated px-3 py-2 text-sm text-arena-textMuted"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {scoring.map(([item, weight]) => (
              <div
                key={item}
                className="rounded-md border border-arena-border bg-arena-background p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-sm font-medium text-white">{item}</span>
                  <span className="text-sm font-semibold tabular-nums text-arena-gold">{weight}%</span>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-sm bg-arena-border" aria-hidden="true">
                  <div className="h-full rounded-sm bg-arena-red" style={{ width: `${weight * 4}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TestimonialsMarquee />

      <section className="border-b border-arena-border bg-arena-background">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">Climb from Novice to Grandmaster.</h2>
            <p className="mt-4 text-base leading-7 text-arena-textMuted">
              Your ELO moves after every attempt. Early performances shift faster. Higher ranks demand sharper, more
              relevant speeches, and the leaderboard keeps the heat on.
            </p>
            <div className="mt-7 grid gap-2 sm:grid-cols-2">
              {ranks.map(([rank, elo]) => (
                <div
                  key={rank}
                  className="flex items-center justify-between rounded-md border border-arena-border bg-arena-surface px-4 py-3"
                >
                  <RankBadge rank={rank} />
                  <span className="text-sm text-arena-gold">{elo}+ ELO</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-arena-border bg-arena-surface p-4">
            <div className="mb-2 flex items-center justify-between gap-4">
              <h3 className="text-xl font-semibold text-white">Leaderboard heat</h3>
              <ArenaRouteLink href="/leaderboard" className="text-sm font-semibold text-arena-gold hover:text-white">
                View all
              </ArenaRouteLink>
            </div>
            {leaderboard.map(([place, name, rank, elo]) => (
              <div
                key={place}
                className="grid grid-cols-[32px_1fr] items-center gap-3 border-b border-arena-border py-3 last:border-b-0 sm:grid-cols-[40px_1fr_100px_70px]"
              >
                <span className="text-sm text-arena-textMuted">{place}</span>
                <span className="font-medium text-white">{name}</span>
                <RankBadge rank={rank} />
                <span className="text-sm text-white sm:text-right">{elo}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="mx-auto max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
          Stop avoiding the room. Step into it.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-arena-textMuted">
          Spin a topic, record one attempt, and leave with a score you can beat.
        </p>
        <div className="mt-8 flex justify-center">
          <ArenaRouteLink
            href="/practice"
            className="rounded-md bg-arena-red px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-arena-redLight focus:outline-none focus:ring-2 focus:ring-arena-redLight focus:ring-offset-2 focus:ring-offset-arena-background"
          >
            Enter practice
          </ArenaRouteLink>
        </div>
      </section>
    </main>
  );
}
