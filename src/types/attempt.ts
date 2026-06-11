import type { EloResult } from "../lib/scoring/calculateElo";
import type { ScoreCalculation } from "../lib/scoring/calculateScores";
import type { EvaluationResponse } from "./evaluation";
import type { Topic, DurationSeconds } from "./topic";

export type SpeechAttemptStatus = "completed" | "failed";

export interface SpeechAttempt {
  id: string;
  userId: string;
  topic: Topic;
  durationSeconds: DurationSeconds;
  transcript: string;
  transcriptWordCount: number;
  audio: {
    fileName: string;
    mimeType: string;
    sizeBytes: number;
  };
  evaluation: EvaluationResponse;
  score: ScoreCalculation;
  elo: EloResult;
  status: SpeechAttemptStatus;
  createdAt: string;
}

export interface AttemptErrorResponse {
  error: {
    code: string;
    message: string;
  };
}
