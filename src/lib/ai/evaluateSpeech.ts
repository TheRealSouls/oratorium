import type { EvaluationResponse } from "../../types/evaluation";
import type { DurationSeconds, Topic } from "../../types/topic";
import { SCORE_KEYS, clampScore } from "../scoring/calculateScores";
import { createOpenAIClient } from "./openaiClient";
import { EVALUATION_SYSTEM_PROMPT, buildEvaluationUserPrompt } from "./prompts";

export const EVALUATION_MODEL = "gpt-4o-mini";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(value: unknown) {
  return typeof value === "string" ? value.slice(0, 1200) : "";
}

function readThreeStrings(value: unknown, fallback: [string, string, string]) {
  const items = Array.isArray(value) ? value.map(readString).filter(Boolean).slice(0, 3) : [];

  while (items.length < 3) {
    items.push(fallback[items.length]);
  }

  return items as [string, string, string];
}

function readBoolean(value: unknown) {
  return typeof value === "boolean" ? value : false;
}

function clampEloEstimate(value: unknown) {
  if (typeof value !== "number" || !Number.isFinite(value)) return 800;
  return Math.max(200, Math.min(2500, Math.round(value)));
}

export function validateEvaluationResponse(value: unknown): EvaluationResponse | null {
  if (!isObject(value) || !isObject(value.rawScores) || !isObject(value.categoryFeedback) || !isObject(value.flags)) {
    return null;
  }

  const rawScoreValues = value.rawScores;
  const categoryFeedbackValues = value.categoryFeedback;
  const flagValues = value.flags;

  const rawScores = SCORE_KEYS.reduce((scores, key) => {
    scores[key] = clampScore(rawScoreValues[key]);
    return scores;
  }, {} as EvaluationResponse["rawScores"]);

  const categoryFeedback = SCORE_KEYS.reduce((feedback, key) => {
    feedback[key] = readString(categoryFeedbackValues[key]) || "No feedback returned for this category.";
    return feedback;
  }, {} as EvaluationResponse["categoryFeedback"]);

  const strengths = readThreeStrings(value.strengths, [
    "You completed the attempt under timed pressure.",
    "There is enough speech material to review the core delivery.",
    "The attempt creates a baseline for the next round.",
  ]);
  const improvements = readThreeStrings(value.improvements, [
    "Stay closer to the selected topic from the first sentence.",
    "Use a clearer structure: claim, reason, example, conclusion.",
    "Develop the speech with more detail before the timer ends.",
  ]);

  return {
    rawScores,
    categoryFeedback,
    strengths,
    improvements,
    nextDrill: readString(value.nextDrill) || "Practise one 60-second speech with a clear claim, reason, example, and final sentence.",
    summaryFeedback: readString(value.summaryFeedback) || "A completed attempt with useful material to build on next round.",
    eloPerformanceEstimate: clampEloEstimate(value.eloPerformanceEstimate),
    flags: {
      tooShort: readBoolean(flagValues.tooShort),
      offTopic: readBoolean(flagValues.offTopic),
      emptyTranscript: readBoolean(flagValues.emptyTranscript),
      possiblePromptInjection: readBoolean(flagValues.possiblePromptInjection),
      harmfulContent: readBoolean(flagValues.harmfulContent),
      lowConfidenceTranscript: readBoolean(flagValues.lowConfidenceTranscript),
    },
  };
}

export async function evaluateSpeech(input: {
  topic: Topic;
  selectedDurationSeconds: DurationSeconds;
  transcript: string;
  userElo: number;
  attemptNumber: number;
}) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const openai = createOpenAIClient(apiKey);
  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_EVALUATION_MODEL || EVALUATION_MODEL,
    messages: [
      { role: "system", content: EVALUATION_SYSTEM_PROMPT },
      { role: "user", content: buildEvaluationUserPrompt(input) },
    ],
    response_format: { type: "json_object" },
    temperature: 0.2,
  });
  const content = response.choices[0]?.message.content;

  if (!content) return null;

  try {
    return validateEvaluationResponse(JSON.parse(content));
  } catch {
    return null;
  }
}
