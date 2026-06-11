import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { DurationSeconds } from "../../../types/topic";
import type { TranscriptionErrorResponse, TranscriptionResponse } from "../../../types/transcription";
import { hasValidAudioSignature, isAllowedAudioMimeType } from "../../../lib/audio/validateAudioUpload";
import { TRANSCRIPTION_MODEL, transcribeAudio } from "../../../lib/ai/transcribe";

export const runtime = "nodejs";

const MAX_AUDIO_BYTES = 25 * 1024 * 1024;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 8;

const requestCounts = new Map<string, { count: number; resetAt: number }>();

function securityHeaders() {
  return {
    "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'; base-uri 'none'",
    "Referrer-Policy": "no-referrer",
    "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
    "X-Content-Type-Options": "nosniff",
  };
}

function jsonResponse(
  body: TranscriptionResponse | TranscriptionErrorResponse,
  status: number
) {
  return NextResponse.json(body, {
    status,
    headers: securityHeaders(),
  });
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

function parseDuration(value: FormDataEntryValue | null): DurationSeconds | undefined {
  if (value !== "60" && value !== "120" && value !== "300") return undefined;
  return Number(value) as DurationSeconds;
}

function wordCount(transcript: string) {
  return transcript.split(/\s+/).filter(Boolean).length;
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
    return jsonResponse(
      { error: { code: "invalid_origin", message: "This request must come from the app." } },
      403
    );
  }

  if (isRateLimited(request)) {
    return jsonResponse(
      { error: { code: "rate_limited", message: "Too many transcription requests. Wait a minute and try again." } },
      429
    );
  }

  if (!request.headers.get("content-type")?.toLowerCase().startsWith("multipart/form-data")) {
    return jsonResponse(
      { error: { code: "invalid_content_type", message: "Upload audio as multipart form data." } },
      415
    );
  }

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return jsonResponse(
      { error: { code: "invalid_form_data", message: "Could not read the uploaded audio." } },
      400
    );
  }

  const audio = formData.get("audio");

  if (!(audio instanceof File)) {
    return jsonResponse(
      { error: { code: "missing_audio", message: "Attach an audio recording before submitting." } },
      400
    );
  }

  if (audio.size === 0) {
    return jsonResponse(
      { error: { code: "empty_audio", message: "The recording is empty. Start a fresh attempt and speak into the microphone." } },
      400
    );
  }

  if (audio.size > MAX_AUDIO_BYTES) {
    return jsonResponse(
      { error: { code: "audio_too_large", message: "Audio must be 25 MB or smaller." } },
      413
    );
  }

  if (!isAllowedAudioMimeType(audio.type)) {
    return jsonResponse(
      { error: { code: "unsupported_audio_type", message: "Upload webm, ogg, wav, mp3, or m4a audio." } },
      415
    );
  }

  const signature = new Uint8Array(await audio.slice(0, 16).arrayBuffer());

  if (signature.length < 12 || !hasValidAudioSignature(signature)) {
    return jsonResponse(
      { error: { code: "invalid_audio_file", message: "The uploaded file does not look like valid audio." } },
      400
    );
  }

  try {
    const transcript = await transcribeAudio(audio);

    if (!transcript) {
      return jsonResponse(
        { error: { code: "empty_transcript", message: "No speech was detected in the recording." } },
        422
      );
    }

    return jsonResponse(
      {
        transcript,
        metadata: {
          provider: "openai",
          model: TRANSCRIPTION_MODEL,
          fileName: audio.name,
          mimeType: audio.type,
          sizeBytes: audio.size,
          wordCount: wordCount(transcript),
          characterCount: transcript.length,
          selectedDurationSeconds: parseDuration(formData.get("durationSeconds")),
        },
      },
      200
    );
  } catch {
    return jsonResponse(
      { error: { code: "transcription_failed", message: "Transcription failed. Try again in a moment." } },
      502
    );
  }
}
