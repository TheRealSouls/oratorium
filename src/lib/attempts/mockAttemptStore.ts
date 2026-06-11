import type { SpeechAttempt } from "../../types/attempt";

const attempts = new Map<string, SpeechAttempt>();

export function saveAttempt(attempt: SpeechAttempt) {
  attempts.set(attempt.id, attempt);
  return attempt;
}

export function getAttempt(attemptId: string) {
  return attempts.get(attemptId) ?? null;
}

export function getUserAttemptCount(userId: string) {
  return [...attempts.values()].filter((attempt) => attempt.userId === userId && attempt.status === "completed").length;
}
