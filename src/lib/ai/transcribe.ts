import { createOpenAIClient } from "./openaiClient";

export const TRANSCRIPTION_MODEL = "gpt-4o-transcribe";

export async function transcribeAudio(file: File) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const openai = createOpenAIClient(apiKey);
  const transcription = await openai.audio.transcriptions.create({
    file,
    model: TRANSCRIPTION_MODEL,
    response_format: "json",
  });

  return transcription.text.trim();
}
