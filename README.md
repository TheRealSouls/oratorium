# Oratorium

Oratorium is a competitive public speaking practice app.

Spin a debate topic, speak under pressure, get AI feedback, receive a score, and climb the ranks. The app is designed to feel less like homework and more like stepping into a small red-lit speaking arena where the judges have clipboards, the timer is merciless, and your next attempt can always be better.

## What It Does

- Spins a topic wheel across General, Irish, School, Fun, or Mixed categories.
- Locks the selected topic so the user cannot quietly reroll away from pressure.
- Supports 1, 2, and 5 minute speaking rounds.
- Records microphone audio in the browser with the MediaRecorder API.
- Uploads audio to server-side Next.js API routes.
- Transcribes speech with the OpenAI API.
- Evaluates the transcript with a structured AI speech judging prompt.
- Enforces deterministic server-side scoring, including the relevance cap.
- Calculates an ELO-style speaking rating.
- Shows a feedback scorecard with strengths, improvements, transcript, score breakdown, and rank movement.
- Includes leaderboard and profile screens with mock data that can be swapped for Firebase later.

## Product Philosophy

Oratorium is not just a voice recorder. It is a speaking pressure chamber.

The core loop is:

```txt
Spin -> Speak -> Transcribe -> Evaluate -> Score -> Improve
```

The app rewards relevant, clear, structured speaking. It does not judge whether the app agrees with the speaker's beliefs. It judges whether the speaker answered the topic well.

## Tech Stack

- Framework: Next.js App Router
- Language: TypeScript
- Styling: Tailwind CSS
- Frontend: React
- Recording: Browser MediaRecorder API
- Backend: Next.js route handlers
- AI: OpenAI transcription and evaluation
- Tests: Vitest
- Future persistence target: Firebase Auth, Firestore, and optional Firebase Storage

## Core Routes

```txt
/                    Landing page
/practice            Topic wheel, timer, and recording flow
/results/[attemptId] Feedback scorecard
/leaderboard         Public rank table
/profile             Mock user stats and recent progress
```

## Getting Started

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.local.example .env.local
```

Set your OpenAI API key in `.env.local`:

```bash
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENAI_EVALUATION_MODEL=gpt-4o-mini
```

Run the development server:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

## Scripts

```bash
npm run dev      # clear stale Next dev cache, then start the app
npm run build    # create a production build
npm run start    # serve the production build
npm test         # run Vitest tests
```

## Scoring System

Every attempt is scored from 0 to 100 across:

- Relevance
- Clarity
- Structure
- Tone
- Confidence
- Pacing
- Evocativeness
- Argument quality
- Conclusion

Relevance is the anchor score. If a speech does not answer the topic, it cannot receive high scores elsewhere.

```ts
cappedScore = Math.min(rawCategoryScore, relevanceScore);
```

Weighted overall score:

```txt
Relevance:          25%
Clarity:            12%
Structure:          12%
Tone:                8%
Confidence:          8%
Pacing:              8%
Evocativeness:       8%
Argument quality:   14%
Conclusion:          5%
```

The backend enforces score validation, clamping, relevance caps, and final weighted score calculation. The client is not trusted for final scoring.

## ELO Rating

New speakers start at 800 ELO. Ratings are designed to sit roughly between 200 and 2500.

Rating changes depend on:

- Current ELO
- Overall score
- Topic difficulty
- Selected speech duration
- Number of previous attempts

Rank titles:

| ELO Range | Rank |
| ---: | --- |
| 200-499 | Novice |
| 500-799 | Bronze |
| 800-1099 | Silver |
| 1100-1399 | Gold |
| 1400-1699 | Platinum |
| 1700-1999 | Diamond |
| 2000-2299 | Master |
| 2300-2500 | Grandmaster |

## OpenAI Flow

Audio and evaluation stay server-side.

```txt
Browser recording
  -> /api/attempts
  -> validate audio type and size
  -> OpenAI transcription
  -> AI evaluation JSON
  -> deterministic score calculation
  -> ELO calculation
  -> result stored in mock attempt store
  -> /results/[attemptId]
```

The API key must never be exposed to the browser.

## Important Files

```txt
src/app/practice/page.tsx                 Practice route
src/components/practice/PracticeArena.tsx Main practice experience
src/components/practice/RecordingPanel.tsx Recording and submission UI
src/app/api/attempts/route.ts             Full transcribe/evaluate/score endpoint
src/lib/audio/validateAudioUpload.ts      Audio validation
src/lib/ai/transcribe.ts                  OpenAI transcription call
src/lib/ai/evaluateSpeech.ts              AI evaluator call and JSON validation
src/lib/scoring/calculateScores.ts        Relevance cap and weighted score logic
src/lib/scoring/calculateElo.ts           Rating logic
src/lib/topics/                           Topic data and selection utilities
```

## Testing

Run:

```bash
npm test
```

Covered areas include:

- Audio MIME normalization and validation
- Relevance cap scoring
- Weighted score calculation
- ELO changes and bounds

## Privacy And Safety

- `.env.local` is ignored and must stay local.
- Audio is validated server-side before processing.
- Transcripts are treated as untrusted user content.
- Prompt injection attempts inside speech are explicitly ignored by the evaluator prompt.
- Private transcripts and recordings are not designed to be public leaderboard data.

## Current MVP Status

The app currently focuses on the core speaking loop and uses mock persistence for attempts, leaderboard entries, and profile data. Firebase can be added after the main loop is stable.

The tiny stage is built. The spotlight is on. The wheel is waiting.

