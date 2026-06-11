"use client";

import { useState } from "react";
import type { DurationSeconds, Topic } from "../../types/topic";
import type { EloResult } from "../../lib/scoring/calculateElo";
import type { ScoreCalculation, ScoreKey } from "../../lib/scoring/calculateScores";
import { SCORE_KEYS, SCORE_LABELS, SCORE_WEIGHTS } from "../../lib/scoring/calculateScores";
import { ArenaRouteLink } from "../layout/ArenaRouteLink";

export interface ResultsFeedback {
  categoryFeedback: Record<ScoreKey, string>;
  strengths: string[];
  improvements: string[];
  nextDrill: string;
  summaryFeedback: string;
}

export interface ResultsScreenProps {
  attemptId: string;
  topic: Topic;
  durationSeconds: DurationSeconds;
  score: ScoreCalculation;
  elo: EloResult;
  feedback: ResultsFeedback;
  transcript: string;
}

function signedNumber(value: number) {
  return value > 0 ? `+${value}` : String(value);
}

function scoreTone(score: number) {
  if (score >= 80) return "Elite round";
  if (score >= 65) return "Strong round";
  if (score >= 45) return "Training round";
  return "Reset round";
}

const confettiColors = ["#FF1E3C", "#FFB000", "#FFF7F8", "#20C997"];
const confettiPieces = Array.from({ length: 34 }, (_, index) => ({
  left: `${(index * 17) % 100}%`,
  delay: `${(index % 8) * 80}ms`,
  duration: `${1300 + (index % 6) * 150}ms`,
  color: confettiColors[index % confettiColors.length],
  width: index % 3 === 0 ? "10px" : "7px",
  height: index % 4 === 0 ? "18px" : "12px",
  rotate: `${index * 29}deg`,
}));

async function shareResult(score: number, rank: string) {
  const text = `I scored ${score}/100 and reached ${rank} on Oratorium.`;

  if (navigator.share) {
    await navigator.share({ title: "Oratorium result", text });
    return;
  }

  await navigator.clipboard.writeText(text);
}

export function ResultsScreen({
  attemptId,
  topic,
  durationSeconds,
  score,
  elo,
  feedback,
  transcript,
}: ResultsScreenProps) {
  const [shareStatus, setShareStatus] = useState("");
  const shouldCelebrate = score.overallScore >= 70;

  async function handleShare() {
    try {
      await shareResult(score.overallScore, elo.rankAfter);
      setShareStatus("Result copied.");
    } catch {
      setShareStatus("Sharing is not available right now.");
    }
  }

  return (
    <main className="min-h-screen bg-[#0B0506] px-4 py-6 text-[#FFF7F8] sm:px-6 lg:px-8">
      {shouldCelebrate && (
        <div className="pointer-events-none fixed inset-x-0 top-0 z-40 h-72 overflow-hidden" aria-hidden="true">
          {confettiPieces.map((piece, index) => (
            <span
              key={index}
              className="results-confetti-piece absolute top-[-24px] rounded-sm"
              style={{
                left: piece.left,
                width: piece.width,
                height: piece.height,
                backgroundColor: piece.color,
                animationDelay: piece.delay,
                animationDuration: piece.duration,
                transform: `rotate(${piece.rotate})`,
              }}
            />
          ))}
        </div>
      )}

      <section className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-3 border-b border-[#3A151B] pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-sm font-medium text-[#FFB000]">{scoreTone(score.overallScore)}</div>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal sm:text-4xl">Arena feedback</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#D9A7AF]">
              {topic.title} / {durationSeconds / 60} minute speech / attempt {attemptId}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <ArenaRouteLink
              href="/practice"
              className="rounded-md bg-[#FF1E3C] px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[#FF5A6E]"
            >
              Try again
            </ArenaRouteLink>
            <button
              type="button"
              onClick={handleShare}
              className="rounded-md border border-[#4A1B22] px-4 py-3 text-sm font-semibold text-[#D9A7AF] transition-colors hover:border-[#FF5A6E] hover:text-white"
            >
              Share result
            </button>
          </div>
        </div>
        {shareStatus && <div className="mt-3 text-sm text-[#D9A7AF]">{shareStatus}</div>}

        {shouldCelebrate && (
          <section
            className="mt-5 rounded-lg border border-[#6B2A12] bg-[#2B1607] p-5"
            aria-live="polite"
          >
            <div className="text-sm font-semibold text-[#FFB000]">Hoorah! Congratulations.</div>
            <h2 className="mt-2 text-2xl font-semibold text-white">You broke 70.</h2>
            <p className="mt-2 text-sm leading-6 text-[#F2C8A0]">
              That is a strong arena round. Lock in what worked, then chase the next bracket.
            </p>
          </section>
        )}

        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_360px]">
          <section className="rounded-lg border border-[#3A151B] bg-[#18090B] p-5">
            <div className="grid gap-4 sm:grid-cols-[180px_1fr]">
              <div className="rounded-lg border border-[#4A1B22] bg-[#0B0506] p-4 text-center">
                <div className="text-sm text-[#D9A7AF]">Overall score</div>
                <div className="mt-2 text-6xl font-semibold tabular-nums text-[#FFF7F8]">
                  {score.overallScore}
                </div>
                <div className="mt-1 text-sm text-[#D9A7AF]">out of 100</div>
              </div>

              <div className="rounded-lg border border-[#4A1B22] bg-[#0B0506] p-4">
                <div className="text-sm text-[#D9A7AF]">Coach summary</div>
                <p className="mt-3 text-base leading-7 text-[#FFF7F8]">{feedback.summaryFeedback}</p>
              </div>
            </div>

            {score.capApplied && (
              <div className="mt-4 rounded-lg border border-[#6B2A12] bg-[#2B1607] p-4">
                <div className="font-medium text-[#FFB000]">Relevance cap applied</div>
                <p className="mt-2 text-sm leading-6 text-[#F2C8A0]">
                  Your relevance score was {score.cappedScores.relevance}/100, so no other category could score
                  above {score.cappedScores.relevance}. Strong delivery only counts when it stays on the topic.
                </p>
              </div>
            )}

            <div className="mt-5">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <h2 className="text-lg font-semibold">Score breakdown</h2>
                <p className="text-sm text-[#D9A7AF]">Weights apply after the relevance cap.</p>
              </div>
              <div className="mt-3 grid gap-3">
                {SCORE_KEYS.map((key) => {
                  const capped = score.cappedScores[key];
                  const raw = score.uncappedScores[key];
                  const weight = Math.round(SCORE_WEIGHTS[key] * 100);

                  return (
                    <div key={key} className="rounded-md border border-[#3A151B] bg-[#0B0506] p-3">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="font-medium">{SCORE_LABELS[key]}</div>
                          <div className="mt-0.5 text-xs tabular-nums text-[#FFB000]">{weight}% of overall</div>
                        </div>
                        <div className="text-sm tabular-nums text-[#D9A7AF] sm:text-right">
                          <div>{capped}/100</div>
                          {raw !== capped && <div className="text-xs">capped from {raw}</div>}
                        </div>
                      </div>
                      <div
                        className="mt-2 h-2 overflow-hidden rounded-md bg-[#240D10]"
                        role="meter"
                        aria-label={`${SCORE_LABELS[key]} score`}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={capped}
                      >
                        <div
                          className="h-full bg-[#FF1E3C] transition-[width] duration-200"
                          style={{ width: `${capped}%` }}
                        />
                      </div>
                      <p className="mt-2 text-sm leading-6 text-[#D9A7AF]">{feedback.categoryFeedback[key]}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <aside className="grid gap-4">
            <section className="rounded-lg border border-[#3A151B] bg-[#18090B] p-5">
              <h2 className="text-lg font-semibold">Rating change</h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-md border border-[#4A1B22] bg-[#0B0506] p-3">
                  <div className="text-xs text-[#D9A7AF]">ELO change</div>
                  <div className="mt-1 text-3xl font-semibold tabular-nums text-[#FFB000]">
                    {signedNumber(elo.change)}
                  </div>
                </div>
                <div className="rounded-md border border-[#4A1B22] bg-[#0B0506] p-3">
                  <div className="text-xs text-[#D9A7AF]">New ELO</div>
                  <div className="mt-1 text-3xl font-semibold tabular-nums">{elo.eloAfter}</div>
                </div>
              </div>
              <div className="mt-3 rounded-md border border-[#4A1B22] bg-[#0B0506] p-3">
                <div className="text-xs text-[#D9A7AF]">Rank</div>
                <div className="mt-1 text-2xl font-semibold">{elo.rankAfter}</div>
                <div className="mt-1 text-sm text-[#D9A7AF]">
                  Previous: {elo.eloBefore} / {elo.rankBefore}
                </div>
              </div>
            </section>

            <section className="rounded-lg border border-[#3A151B] bg-[#18090B] p-5">
              <h2 className="text-lg font-semibold">Strengths</h2>
              <ul className="mt-3 grid gap-2">
                {feedback.strengths.map((strength) => (
                  <li key={strength} className="rounded-md border border-[#21483D] bg-[#0B1F1A] p-3 text-sm">
                    {strength}
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-lg border border-[#3A151B] bg-[#18090B] p-5">
              <h2 className="text-lg font-semibold">Improvements</h2>
              <ul className="mt-3 grid gap-2">
                {feedback.improvements.map((improvement) => (
                  <li key={improvement} className="rounded-md border border-[#4A1B22] bg-[#240D10] p-3 text-sm">
                    {improvement}
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-lg border border-[#6B2A12] bg-[#2B1607] p-5">
              <h2 className="text-lg font-semibold text-[#FFB000]">Next drill</h2>
              <p className="mt-3 text-sm leading-6 text-[#F2C8A0]">{feedback.nextDrill}</p>
            </section>
          </aside>
        </div>

        <section className="mt-4 rounded-lg border border-[#3A151B] bg-[#18090B] p-5">
          <h2 className="text-lg font-semibold">Transcript</h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#D9A7AF]">{transcript}</p>
        </section>
      </section>
    </main>
  );
}
