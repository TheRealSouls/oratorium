import type { Topic, TopicCategory, TopicDifficulty, TopicSensitivity } from "../../types/topic";
import { generateWheelTag } from "./generateWheelTag";

export type TopicSeedTuple = readonly [
  title: string,
  tags: readonly string[],
  difficulty?: TopicDifficulty,
  sensitivity?: TopicSensitivity,
];

export type TopicSeed = string | TopicSeedTuple;

const defaultsByCategory: Record<TopicCategory, { difficulty: TopicDifficulty; sensitivity: TopicSensitivity }> = {
  general: { difficulty: "intermediate", sensitivity: "moderate" },
  irish: { difficulty: "intermediate", sensitivity: "moderate" },
  school: { difficulty: "beginner", sensitivity: "safe" },
  fun: { difficulty: "beginner", sensitivity: "safe" },
};

const promptLeadByCategory: Record<TopicCategory, string> = {
  general: "Argue one side of this debate",
  irish: "Argue one side of this Ireland-focused debate",
  school: "Give a school-safe speech on this question",
  fun: "Make a playful but structured case",
};

const tagRules: readonly [tag: string, terms: readonly string[]][] = [
  ["housing", ["housing", "rent", "homes", "apartments", "accommodation", "holiday homes"]],
  ["transport", ["transport", "metro", "rail", "bus", "airport", "cars", "cycling", "roads", "freight", "ports"]],
  ["climate", ["climate", "wind", "energy", "flood", "peat", "forestry", "marine", "water", "recycling", "vapes", "data centers"]],
  ["education", ["school", "schools", "students", "leaving cert", "university", "college", "cao", "homework", "exams", "grades", "curriculum", "teachers"]],
  ["technology", ["ai", "social media", "smartphones", "phones", "apps", "online", "data", "deepfakes", "crypto", "driverless", "facial recognition", "wi-fi"]],
  ["democracy", ["voting", "democracy", "politicians", "campaign", "elections", "seanad", "mayors", "councils"]],
  ["law", ["legal", "law", "laws", "police", "policing", "prisons", "juries", "sentencing", "permits"]],
  ["health", ["health", "healthcare", "vaccine", "lockdowns", "sugar", "alcohol", "gambling", "sleep", "counselling"]],
  ["economics", ["capitalism", "tax", "wealth", "minimum wage", "pay", "work", "corporation", "fund", "business", "economy"]],
  ["culture", ["language", "irish", "gaeltacht", "rte", "media", "arts", "history", "religion", "celebrity", "museums"]],
  ["sport", ["sport", "gaa", "athletes", "league of ireland", "football", "teams", "trophies"]],
  ["food", ["pizza", "water", "sandwich", "cereal", "fries", "breakfast", "tea", "coffee", "soup", "bread", "brownie", "pasta", "sauce", "leftovers", "snack"]],
  ["performance", ["speeches", "debates", "karaoke", "confidence", "gestures", "eye contact", "pauses", "theme song"]],
  ["routine", ["alarms", "bed", "weekends", "late", "morning", "night", "chores", "dishwasher", "productivity"]],
];

const sensitiveTerms = [
  "abortion",
  "asylum",
  "assisted dying",
  "cannabis",
  "death penalty",
  "direct provision",
  "drug",
  "euthanasia",
  "gun",
  "hate crime",
  "homeless",
  "immigration",
  "lockdowns",
  "military",
  "neutral",
  "palestine",
  "prison",
  "refugee",
  "terrorist",
  "trans athletes",
  "vaccine",
];

const advancedTerms = [
  "ai",
  "campaign spending",
  "corporation tax",
  "democracy",
  "deepfakes",
  "defence",
  "facial recognition",
  "international",
  "juries",
  "metrolink",
  "neutrality",
  "planning objections",
  "reparations",
  "sovereign",
  "tax",
];

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function inferTags(title: string, category: TopicCategory) {
  const lowerTitle = title.toLowerCase();
  const tags = tagRules
    .filter(([, terms]) => terms.some((term) => lowerTitle.includes(term)))
    .map(([tag]) => tag)
    .slice(0, 3);

  if (!tags.includes(category)) tags.push(category);
  return tags.slice(0, 3);
}

function inferDifficulty(title: string, category: TopicCategory, fallback: TopicDifficulty) {
  if (category === "fun" || category === "school") return fallback;

  const lowerTitle = title.toLowerCase();
  if (advancedTerms.some((term) => lowerTitle.includes(term))) return "advanced";
  return fallback;
}

function inferSensitivity(title: string, category: TopicCategory, fallback: TopicSensitivity) {
  if (category === "fun" || category === "school") return "safe";

  const lowerTitle = title.toLowerCase();
  if (sensitiveTerms.some((term) => lowerTitle.includes(term))) return "sensitive";
  return fallback;
}

export function buildTopics(category: TopicCategory, seeds: readonly TopicSeed[]): Topic[] {
  const defaults = defaultsByCategory[category];
  const promptLead = promptLeadByCategory[category];

  return seeds.map((seed) => {
    const title = typeof seed === "string" ? seed : seed[0];
    const tags = typeof seed === "string" ? inferTags(seed, category) : seed[1];
    const difficulty = typeof seed === "string" ? undefined : seed[2];
    const sensitivity = typeof seed === "string" ? undefined : seed[3];

    return {
      id: `${category}-${slugify(title)}`,
      category,
      title,
      prompt: `${promptLead}: ${title} Use reasons, examples, and a fair response to the other side.`,
      difficulty: difficulty ?? inferDifficulty(title, category, defaults.difficulty),
      sensitivity: sensitivity ?? inferSensitivity(title, category, defaults.sensitivity),
      suggestedStanceMode: "either",
      tags: [...tags],
      wheelTag: generateWheelTag(title),
    };
  });
}
