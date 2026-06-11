"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { DurationSeconds, Topic } from "../../types/topic";
import type { AttemptErrorResponse, SpeechAttempt } from "../../types/attempt";
import { getAudioFileExtension } from "../../lib/audio/validateAudioUpload";
import { ArenaLoading } from "../ui/ArenaLoading";
import { RecordingCountdown } from "./RecordingCountdown";
import { useSpeechRecorder } from "./useSpeechRecorder";
import type { RecordingStatus } from "./useSpeechRecorder";

interface RecordingPanelProps {
  topic: Topic;
  durationSeconds: DurationSeconds;
  autoStart?: boolean;
  onLockedChange: (isLocked: boolean) => void;
  onStatusChange?: (status: RecordingStatus) => void;
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

const submissionSteps = [
  "Uploading audio",
  "Transcribing speech",
  "Evaluating delivery",
  "Calculating score",
  "Opening scorecard",
];

export function RecordingPanel({
  topic,
  durationSeconds,
  autoStart = false,
  onLockedChange,
  onStatusChange,
}: RecordingPanelProps) {
  const router = useRouter();
  const recorder = useSpeechRecorder(durationSeconds);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "submitted" | "failed">("idle");
  const [submitError, setSubmitError] = useState("");
  const [attemptId, setAttemptId] = useState("");
  const [submissionStepIndex, setSubmissionStepIndex] = useState(0);
  const autoStartedRef = useRef(false);
  const isAwaitingResult = submitStatus === "submitting" || submitStatus === "submitted";

  useEffect(() => {
    onLockedChange(
      recorder.status === "preparing" ||
        recorder.status === "countdown" ||
        recorder.status === "recording" ||
        recorder.status === "preview"
    );
  }, [onLockedChange, recorder.status]);

  useEffect(() => {
    return () => onLockedChange(false);
  }, [onLockedChange]);

  useEffect(() => {
    onStatusChange?.(recorder.status);
  }, [onStatusChange, recorder.status]);

  useEffect(() => {
    if (!isAwaitingResult) {
      setSubmissionStepIndex(0);
      return;
    }

    if (submitStatus === "submitted") {
      setSubmissionStepIndex(submissionSteps.length - 1);
      return;
    }

    const interval = window.setInterval(() => {
      setSubmissionStepIndex((current) => Math.min(current + 1, submissionSteps.length - 2));
    }, 1200);

    return () => window.clearInterval(interval);
  }, [isAwaitingResult, submitStatus]);

  useEffect(() => {
    if (!autoStart || autoStartedRef.current || recorder.status !== "idle") return;

    autoStartedRef.current = true;
    void recorder.startRecording();
  }, [autoStart, recorder]);

  const submitRecording = useCallback(async () => {
    if (!recorder.audioBlob || submitStatus === "submitting" || submitStatus === "submitted") return;

    setSubmitStatus("submitting");
    setSubmitError("");

    const formData = new FormData();
    formData.append("audio", recorder.audioBlob, `speech.${getAudioFileExtension(recorder.mimeType)}`);
    formData.append("topicId", topic.id);
    formData.append("durationSeconds", String(durationSeconds));

    try {
      const response = await fetch("/api/attempts", {
        method: "POST",
        body: formData,
      });
      const payload = (await response.json().catch(() => null)) as SpeechAttempt | AttemptErrorResponse | null;

      if (!response.ok) {
        throw new Error(payload && "error" in payload ? payload.error.message : "Attempt submission failed.");
      }

      if (!payload || !("id" in payload)) {
        throw new Error("The server returned an invalid attempt.");
      }

      sessionStorage.setItem(`oratorium.attempt.${payload.id}`, JSON.stringify(payload));
      setAttemptId(payload.id);
      setSubmitStatus("submitted");
      router.push(`/results/${payload.id}`);
    } catch (caughtError) {
      setSubmitStatus("failed");
      setSubmitError(
        caughtError instanceof Error
          ? caughtError.message
          : "Could not process the recording. The locked audio is still available to retry."
      );
    }
  }, [durationSeconds, recorder.audioBlob, recorder.mimeType, router, submitStatus, topic.id]);

  useEffect(() => {
    if (recorder.status === "preview" && recorder.audioBlob && submitStatus === "idle") {
      void submitRecording();
    }
  }, [recorder.audioBlob, recorder.status, submitRecording, submitStatus]);

  return (
    <div className="mt-5 rounded-lg border border-[#3A151B] bg-[#0B0506] p-4">
      {isAwaitingResult && (
        <ArenaLoading
          mode="modal"
          label="Arena feedback"
          title="Judges are scoring your round"
          message={submissionSteps[submissionStepIndex]}
        />
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-sm text-[#FFB000]">Speaking round</div>
          <h3 className="mt-2 text-xl font-semibold">{topic.title}</h3>
          <p className="mt-2 text-sm leading-6 text-[#D9A7AF]">{topic.prompt}</p>
        </div>
        <div className="rounded-md border border-[#4A1B22] bg-[#18090B] px-4 py-3 text-right">
          <div className="text-xs text-[#D9A7AF]">Time left</div>
          <div className="mt-1 text-3xl font-semibold tabular-nums text-[#FFF7F8]">
            {formatTime(recorder.remainingSeconds)}
          </div>
        </div>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-md bg-[#240D10]">
        <div
          className="h-full bg-[#FF1E3C] transition-[width] duration-150"
          style={{
            width: `${Math.max(0, Math.min(100, (recorder.remainingSeconds / durationSeconds) * 100))}%`,
          }}
        />
      </div>

      <div className="mt-4 rounded-md border border-[#3A151B] bg-[#18090B] p-4">
        {recorder.status === "idle" && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="font-medium">Mic check. Then it&apos;s your stage.</div>
              <div className="mt-1 text-sm text-[#D9A7AF]">
                {autoStart ? "Microphone setup is starting now." : "Press start, breathe, then own the room."}
              </div>
            </div>
            {!autoStart && (
              <button
                type="button"
                onClick={recorder.startRecording}
                className="rounded-md bg-[#FF1E3C] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#FF5A6E]"
              >
                Start
              </button>
            )}
          </div>
        )}

        {recorder.status === "preparing" && (
          <div className="text-sm text-[#D9A7AF]">Mic check. Then it&apos;s your stage.</div>
        )}

        {recorder.status === "countdown" && <RecordingCountdown countdown={recorder.countdown} />}

        {recorder.status === "recording" && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="font-medium text-[#FF5A6E]">Speak now.</div>
              <div className="mt-1 text-sm text-[#D9A7AF]">
                Stay on topic. Land the argument before the clock hits zero.
              </div>
            </div>
            <button
              type="button"
              onClick={recorder.stopRecording}
              className="rounded-md border border-[#FF5A6E] px-4 py-3 text-sm font-semibold text-[#FFF7F8] transition-colors hover:bg-[#240D10]"
            >
              Stop early
            </button>
          </div>
        )}

        {recorder.status === "preview" && (
          <div>
            <div className="font-medium">Attempt locked.</div>
            <div className="mt-1 text-sm text-[#D9A7AF]">
              What you said under pressure is being sent for judging now.
            </div>
            <audio className="mt-3 w-full" controls src={recorder.audioUrl} />
            <div className="mt-4 rounded-md border border-[#4A1B22] bg-[#0B0506] p-3 text-sm text-[#D9A7AF]">
              {submitStatus === "submitting" && "Transcribing, evaluating, scoring, and saving your attempt..."}
              {submitStatus === "submitted" && `Result ready. Opening scorecard ${attemptId}.`}
              {submitStatus === "failed" && (
                <>
                  <span className="font-medium text-[#FF5A6E]">Submission failed.</span>{" "}
                  {submitError || "Retry the same locked recording below."}
                </>
              )}
            </div>
            {submitStatus === "failed" && (
              <button
                type="button"
                onClick={submitRecording}
                className="mt-3 rounded-md bg-[#FF1E3C] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#FF5A6E]"
              >
                Retry same recording
              </button>
            )}
          </div>
        )}

        {recorder.status === "error" && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="font-medium text-[#FF5A6E]">Recording blocked.</div>
              <div className="mt-1 text-sm text-[#D9A7AF]">{recorder.error}</div>
            </div>
            <button
              type="button"
              onClick={() => recorder.resetRecording()}
              className="rounded-md border border-[#4A1B22] px-4 py-3 text-sm font-semibold text-[#D9A7AF] transition-colors hover:border-[#FF5A6E] hover:text-white"
            >
              Reset
            </button>
          </div>
        )}

        {submitError && submitStatus !== "failed" && <div className="mt-3 text-sm text-[#FF5A6E]">{submitError}</div>}
      </div>
    </div>
  );
}
