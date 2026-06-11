"use client";

import { useEffect, useRef } from "react";
import type { DurationSeconds, Topic } from "../../types/topic";
import { PrepCountdown } from "./PrepCountdown";

interface SelectedTopicModalProps {
  topic: Topic;
  durationSeconds: DurationSeconds;
  rerollUsed: boolean;
  isPrepActive: boolean;
  onStartPrep: () => void;
  onPrepComplete: () => void;
  onReroll: () => void;
  onClose: () => void;
}

function formatDuration(durationSeconds: DurationSeconds) {
  return `${durationSeconds / 60} minute${durationSeconds === 60 ? "" : "s"}`;
}

export function SelectedTopicModal({
  topic,
  durationSeconds,
  rerollUsed,
  isPrepActive,
  onStartPrep,
  onPrepComplete,
  onReroll,
  onClose,
}: SelectedTopicModalProps) {
  const dialogRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    dialogRef.current?.focus();
  }, [isPrepActive, topic.id]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#0B0506]/85 px-4 py-6">
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="selected-topic-title"
        tabIndex={-1}
        className="max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-lg border border-[#FFB000] bg-[#18090B] p-5"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-[#FFB000]">
              {isPrepActive ? "Prep Clock" : "Topic Locked"}
            </div>
            <h2 id="selected-topic-title" className="mt-2 text-3xl font-semibold text-white">
              {isPrepActive ? "Recording starts soon" : "Your speaking challenge"}
            </h2>
          </div>
          {!isPrepActive && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-[#4A1B22] px-3 py-2 text-sm text-[#D9A7AF] transition-colors hover:border-[#FF5A6E] hover:text-white"
            >
              Close
            </button>
          )}
        </div>

        {isPrepActive ? (
          <PrepCountdown
            topic={topic}
            durationSeconds={durationSeconds}
            seconds={10}
            onComplete={onPrepComplete}
          />
        ) : (
          <>
            <div className="mt-5 rounded-lg border border-[#3A151B] bg-[#0B0506] p-4">
              <h3 className="text-2xl font-semibold text-white">{topic.title}</h3>
              <div className="mt-4 text-sm font-semibold text-[#FFF7F8]">Prompt:</div>
              <p className="mt-2 text-sm leading-6 text-[#D9A7AF]">{topic.prompt}</p>

              <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  ["Category", topic.category],
                  ["Difficulty", topic.difficulty],
                  ["Sensitivity", topic.sensitivity],
                  ["Duration", formatDuration(durationSeconds)],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-md border border-[#3A151B] bg-[#18090B] p-3">
                    <dt className="text-xs text-[#D9A7AF]">{label}</dt>
                    <dd className="mt-1 capitalize text-white">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <p className="mt-4 text-sm text-[#D9A7AF]">Preparation begins in 10 seconds after you start prep.</p>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={onStartPrep}
                className="rounded-md bg-[#FF1E3C] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#FF5A6E]"
              >
                Start Prep
              </button>
              <button
                type="button"
                onClick={onReroll}
                disabled={rerollUsed}
                className="rounded-md border border-[#4A1B22] px-4 py-3 text-sm font-semibold text-[#D9A7AF] transition-colors hover:border-[#FFB000] hover:text-white disabled:cursor-not-allowed disabled:border-[#3A151B] disabled:text-[#7A4A52]"
              >
                {rerollUsed ? "Reroll used" : "Reroll Topic"}
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
