import { existsSync, readFileSync } from "node:fs";
import { Agent as HttpsAgent } from "node:https";
import { resolve } from "node:path";
import OpenAI from "openai";

function getHttpAgent() {
  const caBundlePath = process.env.OPENAI_CA_BUNDLE || resolve(process.cwd(), ".certs", "api-openai-chain.pem");

  if (!existsSync(caBundlePath)) return undefined;

  return new HttpsAgent({
    ca: readFileSync(caBundlePath),
    keepAlive: true,
  });
}

export function createOpenAIClient(apiKey: string) {
  return new OpenAI({
    apiKey,
    httpAgent: getHttpAgent(),
  });
}
