"use client";

import { useEffect, useState } from "react";
import type { AttemptErrorResponse, SpeechAttempt } from "../../types/attempt";
import { ArenaRouteLink } from "../layout/ArenaRouteLink";
import { ArenaLoading } from "../ui/ArenaLoading";
import { ResultsScreen } from "./ResultsScreen";

interface AttemptResultLoaderProps {
  attemptId: string;
}

function getStoredAttempt(attemptId: string) {
  const stored = sessionStorage.getItem(`oratorium.attempt.${attemptId}`);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as SpeechAttempt;
  } catch {
    sessionStorage.removeItem(`oratorium.attempt.${attemptId}`);
    return null;
  }
}

export function AttemptResultLoader({ attemptId }: AttemptResultLoaderProps) {
  const [attempt, setAttempt] = useState<SpeechAttempt | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    const storedAttempt = getStoredAttempt(attemptId);

    if (storedAttempt) {
      setAttempt(storedAttempt);
      return;
    }

    async function loadAttempt() {
      try {
        const response = await fetch(`/api/attempts/${attemptId}`);
        const payload = (await response.json().catch(() => null)) as SpeechAttempt | AttemptErrorResponse | null;

        if (!response.ok) {
          throw new Error(payload && "error" in payload ? payload.error.message : "Attempt not found.");
        }

        if (!payload || !("id" in payload)) {
          throw new Error("The result could not be loaded.");
        }

        if (isMounted) {
          setAttempt(payload);
        }
      } catch (caughtError) {
        if (isMounted) {
          setError(caughtError instanceof Error ? caughtError.message : "The result could not be loaded.");
        }
      }
    }

    void loadAttempt();

    return () => {
      isMounted = false;
    };
  }, [attemptId]);

  if (attempt) {
    return (
      <ResultsScreen
        attemptId={attempt.id}
        topic={attempt.topic}
        durationSeconds={attempt.durationSeconds}
        score={attempt.score}
        elo={attempt.elo}
        feedback={{
          categoryFeedback: attempt.evaluation.categoryFeedback,
          strengths: attempt.evaluation.strengths,
          improvements: attempt.evaluation.improvements,
          nextDrill: attempt.evaluation.nextDrill,
          summaryFeedback: attempt.evaluation.summaryFeedback,
        }}
        transcript={attempt.transcript}
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#0B0506] px-4 py-10 text-[#FFF7F8]">
      {error ? (
        <section className="mx-auto max-w-2xl rounded-lg border border-[#3A151B] bg-[#18090B] p-6">
          <div className="text-sm font-medium text-[#FFB000]">Arena feedback</div>
          <h1 className="mt-2 text-3xl font-semibold">Loading result</h1>
          <p className="mt-3 text-sm leading-6 text-[#D9A7AF]">{error}</p>
          <ArenaRouteLink
            href="/practice"
            className="mt-5 inline-flex rounded-md bg-[#FF1E3C] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#FF5A6E]"
          >
            Start a new attempt
          </ArenaRouteLink>
        </section>
      ) : (
        <ArenaLoading
          label="Arena feedback"
          title="Opening your scorecard"
          message="Pulling your scorecard from the judging desk..."
        />
      )}
    </main>
  );
}
