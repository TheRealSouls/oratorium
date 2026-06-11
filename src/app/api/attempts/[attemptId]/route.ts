import { NextResponse } from "next/server";
import type { AttemptErrorResponse, SpeechAttempt } from "../../../../types/attempt";
import { getAttempt } from "../../../../lib/attempts/mockAttemptStore";

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

export async function GET(_: Request, { params }: { params: Promise<{ attemptId: string }> }) {
  const { attemptId } = await params;
  const attempt = getAttempt(attemptId);

  if (!attempt) {
    return jsonResponse({ error: { code: "attempt_not_found", message: "Attempt not found." } }, 404);
  }

  return jsonResponse(attempt, 200);
}
