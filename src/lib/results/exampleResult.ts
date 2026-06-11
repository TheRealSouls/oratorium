import { calculateElo } from "../scoring/calculateElo";
import { calculateScores } from "../scoring/calculateScores";
import { irishTopics } from "../topics/irish";
import type { ResultsScreenProps } from "../../components/results/ResultsScreen";

const score = calculateScores({
  relevance: 72,
  clarity: 78,
  structure: 68,
  tone: 75,
  confidence: 73,
  pacing: 62,
  evocativeness: 67,
  argumentQuality: 70,
  conclusion: 55,
});

export const exampleResult: ResultsScreenProps = {
  attemptId: "demo-001",
  topic: irishTopics[1],
  durationSeconds: 120,
  score,
  elo: calculateElo({
    currentElo: 800,
    overallScore: score.overallScore,
    topicDifficulty: irishTopics[1].difficulty,
    durationSeconds: 120,
    attemptCount: 3,
  }),
  feedback: {
    categoryFeedback: {
      relevance: "You stayed focused on the housing crisis and addressed the policy question directly.",
      clarity: "The main argument was understandable, though a few sentences needed sharper wording.",
      structure: "There was a clear position and supporting points, but the middle needed stronger signposting.",
      tone: "The tone was serious and suitable for a public policy speech.",
      confidence: "You sounded committed to the argument, especially when describing urgency.",
      pacing: "The speech was short for a two-minute attempt, so some points felt underdeveloped.",
      evocativeness: "The speech had urgency, but it needed a more memorable example or image.",
      argumentQuality: "The argument was relevant and reasonable, but it needed stronger evidence.",
      conclusion: "The ending was clear but brief, and it could have landed with more force.",
    },
    strengths: [
      "Clear position on the housing issue",
      "Relevant policy focus throughout the speech",
      "Controlled tone on a serious topic",
    ],
    improvements: [
      "Use one concrete statistic or example",
      "Signpost your second and third points more clearly",
      "End with a stronger final sentence",
    ],
    nextDrill: "Practise a 90-second policy speech with this structure: problem, cause, solution, final challenge.",
    summaryFeedback:
      "A focused and credible round. Your next jump will come from adding evidence and making the final line hit harder.",
  },
  transcript:
    "Ireland is not doing enough to solve the housing crisis. The problem is not just that homes are expensive, it is that people are losing confidence that they can build a stable life here. We need faster planning, more affordable rental options, and stronger delivery from the state. Private building matters, but the market alone has not solved the problem. If young people are working full time and still cannot afford somewhere secure to live, then the system is not working. Ireland needs to treat housing like essential infrastructure, not just another investment market.",
};
