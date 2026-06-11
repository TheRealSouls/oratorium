import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { AttemptErrorResponse, SpeechAttempt } from "../../../types/attempt";
import type { DurationSeconds } from "../../../types/topic";
import { hasValidAudioSignature, isAllowedAudioMimeType } from "../../../lib/audio/validateAudioUpload";
import { evaluateSpeech } from "../../../lib/ai/evaluateSpeech";
import { transcribeAudio } from "../../../lib/ai/transcribe";
import { getUserAttemptCount, saveAttempt } from "../../../lib/attempts/mockAttemptStore";
import { calculateElo, STARTING_ELO } from "../../../lib/scoring/calculateElo";
import { calculateScores } from "../../../lib/scoring/calculateScores";
import { getTopicById } from "../../../lib/topics/selectTopic";

export const runtime = "nodejs";

const MOCK_USER_ID = "mock-user";
const MAX_AUDIO_BYTES = 25 * 1024 * 1024;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 6;

const requestCounts = new Map<string, { count: number; resetAt: number }>();

function securityHeaders() {
  return {
    "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'; base-uri 'none'",
    "Referrer-Policy": "no-referrer",
    "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
    "X-Content-Type-Options": "nosniff",
  };
}

function jsonResponse(body: SpeechAttempt | AttemptErrorResponse, status: number) {
  return NextResponse.json(body, { status, headers: securityHeaders() });
}

function getClientKey(request: NextRequest) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}

function isRateLimited(request: NextRequest) {
  const key = getClientKey(request);
  const now = Date.now();
  const current = requestCounts.get(key);

  if (!current || current.resetAt <= now) {
    requestCounts.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  current.count += 1;
  return current.count > RATE_LIMIT_MAX_REQUESTS;
}

function isSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");

  if (!origin) return true;
  if (!host) return false;

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

function parseDuration(value: FormDataEntryValue | null): DurationSeconds | null {
  if (value !== "60" && value !== "120" && value !== "300") return null;
  return Number(value) as DurationSeconds;
}

function wordCount(transcript: string) {
  return transcript.split(/\s+/).filter(Boolean).length;
}

function rankedFlags(transcript: string, durationSeconds: DurationSeconds, evaluationFlags: SpeechAttempt["evaluation"]["flags"]) {
  const words = wordCount(transcript);
  const minimumWords = durationSeconds === 60 ? 45 : durationSeconds === 120 ? 90 : 220;

  return {
    ...evaluationFlags,
    emptyTranscript: evaluationFlags.emptyTranscript || words < 5,
    tooShort: evaluationFlags.tooShort || words < minimumWords,
  };
}

export async function POST(request: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return jsonResponse(
      {
        error: {
          code: "server_misconfigured",
          message: "OpenAI API key is missing. Add OPENAI_API_KEY to .env.local and restart npm run dev.",
        },
      },
      500
    );
  }

  if (!isSameOrigin(request)) {
    return jsonResponse({ error: { code: "invalid_origin", message: "This request must come from the app." } }, 403);
  }

  if (isRateLimited(request)) {
    return jsonResponse(
      { error: { code: "rate_limited", message: "Too many attempts. Wait a minute and try again." } },
      429
    );
  }

  if (!request.headers.get("content-type")?.toLowerCase().startsWith("multipart/form-data")) {
    return jsonResponse(
      { error: { code: "invalid_content_type", message: "Upload the attempt as multipart form data." } },
      415
    );
  }

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return jsonResponse({ error: { code: "invalid_form_data", message: "Could not read the attempt upload." } }, 400);
  }

  const audio = formData.get("audio");
  const topicId = formData.get("topicId");
  const durationSeconds = parseDuration(formData.get("durationSeconds"));

  if (!(audio instanceof File)) {
    return jsonResponse({ error: { code: "missing_audio", message: "Attach an audio recording before submitting." } }, 400);
  }

  if (typeof topicId !== "string") {
    return jsonResponse({ error: { code: "missing_topic", message: "Select a topic before submitting." } }, 400);
  }

  const topic = getTopicById(topicId);

  if (!topic) {
    return jsonResponse({ error: { code: "invalid_topic", message: "The selected topic could not be found." } }, 400);
  }

  if (!durationSeconds) {
    return jsonResponse({ error: { code: "invalid_duration", message: "Choose a valid duration." } }, 400);
  }

  if (audio.size === 0) {
    return jsonResponse(
      { error: { code: "empty_audio", message: "The recording is empty. Start a fresh attempt and speak into the microphone." } },
      400
    );
  }

  if (audio.size > MAX_AUDIO_BYTES) {
    return jsonResponse({ error: { code: "audio_too_large", message: "Audio must be 25 MB or smaller." } }, 413);
  }

  if (!isAllowedAudioMimeType(audio.type)) {
    return jsonResponse({ error: { code: "unsupported_audio_type", message: "Upload webm, ogg, wav, mp3, or m4a audio." } }, 415);
  }

  const signature = new Uint8Array(await audio.slice(0, 16).arrayBuffer());

  if (signature.length < 12 || !hasValidAudioSignature(signature)) {
    return jsonResponse(
      { error: { code: "invalid_audio_file", message: "The uploaded file does not look like valid audio." } },
      400
    );
  }

  let transcript: string;

  try {
    transcript = await transcribeAudio(audio);
  } catch {
    return jsonResponse(
      { error: { code: "transcription_failed", message: "Transcription failed. Your locked recording is still available to retry." } },
      502
    );
  }

  if (!transcript) {
    return jsonResponse({ error: { code: "empty_transcript", message: "No speech was detected in the recording." } }, 422);
  }

  const attemptCount = getUserAttemptCount(MOCK_USER_ID);
  let evaluation = await evaluateSpeech({
    topic,
    selectedDurationSeconds: durationSeconds,
    transcript,
    userElo: STARTING_ELO,
    attemptNumber: attemptCount + 1,
  });

  evaluation ??= await evaluateSpeech({
    topic,
    selectedDurationSeconds: durationSeconds,
    transcript,
    userElo: STARTING_ELO,
    attemptNumber: attemptCount + 1,
  });

  if (!evaluation) {
    return jsonResponse(
      { error: { code: "evaluation_failed", message: "Evaluation failed. Your locked recording is still available to retry." } },
      502
    );
  }

  evaluation = {
    ...evaluation,
    flags: rankedFlags(transcript, durationSeconds, evaluation.flags),
  };

  const score = calculateScores(evaluation.rawScores);
  const elo = calculateElo({
    currentElo: STARTING_ELO,
    overallScore: score.overallScore,
    topicDifficulty: topic.difficulty,
    durationSeconds,
    attemptCount,
  });
  const attempt = saveAttempt({
    id: crypto.randomUUID(),
    userId: MOCK_USER_ID,
    topic,
    durationSeconds,
    transcript,
    transcriptWordCount: wordCount(transcript),
    audio: {
      fileName: audio.name,
      mimeType: audio.type,
      sizeBytes: audio.size,
    },
    evaluation,
    score,
    elo,
    status: "completed",
    createdAt: new Date().toISOString(),
  });

  return jsonResponse(attempt, 201);
}
