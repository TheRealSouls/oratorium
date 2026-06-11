"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { RecordingStatus } from "./useSpeechRecorder";
import type { DurationSeconds, TopicCategoryChoice, TopicSelection } from "../../types/topic";
import { getTopicsForCategory, getTopicsInPlay, selectRandomTopic } from "../../lib/topics/selectTopic";
import { CategorySelector } from "./CategorySelector";
import { DurationSelector } from "./DurationSelector";
import { RecordingPanel } from "./RecordingPanel";
import { SelectedTopicModal } from "./SelectedTopicModal";
import { SpinWheel } from "./SpinWheel";
import { TopicsInPlay } from "./TopicsInPlay";

type PracticeState =
  | "idle"
  | "spinning"
  | "topic-revealed"
  | "prep-countdown"
  | "mic-permission"
  | "recording"
  | "recording-complete";

export function PracticeArena() {
  const [categoryChoice, setCategoryChoice] = useState<TopicCategoryChoice>("general");
  const [durationSeconds, setDurationSeconds] = useState<DurationSeconds>(120);
  const [selection, setSelection] = useState<TopicSelection | null>(null);
  const [pendingSelection, setPendingSelection] = useState<TopicSelection | null>(null);
  const [rotationDegrees, setRotationDegrees] = useState(0);
  const [practiceState, setPracticeState] = useState<PracticeState>("idle");
  const [rerollUsed, setRerollUsed] = useState(false);
  const [isAttemptLocked, setIsAttemptLocked] = useState(false);
  const [topicDeckVersion, setTopicDeckVersion] = useState(0);
  const spinTimeoutRef = useRef<number | null>(null);
  const recordingPanelRef = useRef<HTMLDivElement | null>(null);

  const topicPool = useMemo(() => getTopicsForCategory(categoryChoice), [categoryChoice]);
  const topics = useMemo(() => getTopicsInPlay(categoryChoice), [categoryChoice, topicDeckVersion]);
  const activeSelection = selection ?? pendingSelection;
  const controlsLocked =
    practiceState === "spinning" ||
    practiceState === "prep-countdown" ||
    practiceState === "mic-permission" ||
    practiceState === "recording" ||
    practiceState === "recording-complete" ||
    isAttemptLocked;

  useEffect(() => {
    return () => {
      if (spinTimeoutRef.current !== null) {
        window.clearTimeout(spinTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (practiceState !== "mic-permission") return;

    window.requestAnimationFrame(() => {
      recordingPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }, [practiceState]);

  function resetTopicState() {
    if (spinTimeoutRef.current !== null) {
      window.clearTimeout(spinTimeoutRef.current);
      spinTimeoutRef.current = null;
    }

    setSelection(null);
    setPendingSelection(null);
    setPracticeState("idle");
    setRotationDegrees(0);
    setRerollUsed(false);
    setTopicDeckVersion((version) => version + 1);
  }

  function changeCategory(nextCategory: TopicCategoryChoice) {
    if (controlsLocked) return;
    setCategoryChoice(nextCategory);
    resetTopicState();
  }

  function changeDuration(nextDuration: DurationSeconds) {
    if (controlsLocked) return;
    setDurationSeconds(nextDuration);
  }

  function spin(nextRerollUsed = false) {
    if (practiceState === "spinning" || controlsLocked || topics.length === 0) return;

    const nextSelection = selectRandomTopic(categoryChoice, Math.random, topics);
    setPendingSelection(nextSelection);
    setSelection(null);
    setPracticeState("spinning");
    setRotationDegrees((current) => current + nextSelection.wheelRotationDegrees);

    spinTimeoutRef.current = window.setTimeout(() => {
      setSelection(nextSelection);
      setPendingSelection(null);
      setPracticeState("topic-revealed");
      setRerollUsed(nextRerollUsed);
    }, 2600);
  }

  function rerollTopic() {
    if (rerollUsed || practiceState !== "topic-revealed") return;
    setSelection(null);
    spin(true);
  }

  function handleRecordingStatus(status: RecordingStatus) {
    if (status === "preparing") setPracticeState("mic-permission");
    if (status === "countdown" || status === "recording") setPracticeState("recording");
    if (status === "preview") setPracticeState("recording-complete");
  }

  function completePrepCountdown() {
    setPracticeState("mic-permission");
  }

  return (
    <main className="min-h-screen bg-[#0B0506] px-4 py-6 text-[#FFF7F8] sm:px-6 lg:px-8">
      <section className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[360px_1fr]">
        <aside className="rounded-lg border border-[#3A151B] bg-[#18090B] p-4">
          <h1 className="text-2xl font-semibold tracking-normal">Practice Arena</h1>
          <p className="mt-2 text-sm leading-6 text-[#D9A7AF]">
            Pick a category, spin for a topic, then face the prep clock.
          </p>

          <div className="mt-6">
            <CategorySelector value={categoryChoice} disabled={controlsLocked} onChange={changeCategory} />
          </div>

          <div className="mt-6">
            <DurationSelector value={durationSeconds} disabled={controlsLocked} onChange={changeDuration} />
          </div>

          <button
            type="button"
            onClick={() => spin(false)}
            disabled={controlsLocked || topics.length === 0}
            className="mt-6 w-full rounded-md bg-[#FF1E3C] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#FF5A6E] disabled:cursor-not-allowed disabled:bg-[#7A4A52]"
          >
            {practiceState === "spinning" ? "Spinning..." : "Spin the Wheel"}
          </button>
        </aside>

        <section className="rounded-lg border border-[#3A151B] bg-[#18090B] p-4 sm:p-6">
          <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
            <SpinWheel
              topics={topics}
              isSpinning={practiceState === "spinning"}
              resultIndex={selection?.topicIndex}
              rotationDegrees={rotationDegrees}
            />

            <div className="min-w-0">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">Topics in play</h2>
                <span className="rounded-md border border-[#4A1B22] px-2 py-1 text-xs text-[#D9A7AF]">
                  {topics.length} of {topicPool.length} topics
                </span>
              </div>

              <TopicsInPlay topics={topics} selectedTopicId={activeSelection?.topic.id} />

              <div className="mt-5 rounded-lg border border-[#3A151B] bg-[#0B0506] p-4">
                {selection ? (
                  <>
                    {(practiceState === "topic-revealed" || practiceState === "prep-countdown") && (
                      <div className="rounded-md border border-[#3A151B] bg-[#18090B] p-4">
                        <div className="text-sm text-[#FFB000]">Topic locked</div>
                        <h3 className="mt-2 text-xl font-semibold">{selection.topic.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-[#D9A7AF]">
                          {practiceState === "prep-countdown"
                            ? "Prep is running in the arena modal. Recording starts when the countdown ends."
                            : "Your challenge is open in the arena modal."}
                        </p>
                      </div>
                    )}

                    {(practiceState === "mic-permission" ||
                      practiceState === "recording" ||
                      practiceState === "recording-complete") && (
                      <div ref={recordingPanelRef}>
                        <RecordingPanel
                          topic={selection.topic}
                          durationSeconds={durationSeconds}
                          autoStart
                          onLockedChange={setIsAttemptLocked}
                          onStatusChange={handleRecordingStatus}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="py-8 text-center text-sm text-[#D9A7AF]">
                    {practiceState === "spinning"
                      ? "The wheel is choosing your topic."
                      : "Spin to lock a topic for this attempt."}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </section>

      {(practiceState === "topic-revealed" || practiceState === "prep-countdown") && selection && (
        <SelectedTopicModal
          topic={selection.topic}
          durationSeconds={durationSeconds}
          rerollUsed={rerollUsed}
          isPrepActive={practiceState === "prep-countdown"}
          onStartPrep={() => setPracticeState("prep-countdown")}
          onPrepComplete={completePrepCountdown}
          onReroll={rerollTopic}
          onClose={resetTopicState}
        />
      )}
    </main>
  );
}
