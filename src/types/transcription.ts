import type { DurationSeconds } from "./topic";

export interface TranscriptionMetadata {
  provider: "openai";
  model: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  wordCount: number;
  characterCount: number;
  selectedDurationSeconds?: DurationSeconds;
}

export interface TranscriptionResponse {
  transcript: string;
  metadata: TranscriptionMetadata;
}

export interface TranscriptionErrorResponse {
  error: {
    code: string;
    message: string;
  };
}
