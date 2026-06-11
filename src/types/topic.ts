export type TopicCategory = "general" | "irish" | "school" | "fun";

export type TopicCategoryChoice = TopicCategory | "mixed";

export type TopicDifficulty = "beginner" | "intermediate" | "advanced";

export type TopicSensitivity = "safe" | "moderate" | "sensitive";

export type SuggestedStanceMode = "for" | "against" | "either";

export type DurationSeconds = 60 | 120 | 300;

export interface Topic {
  id: string;
  category: TopicCategory;
  title: string;
  prompt: string;
  difficulty: TopicDifficulty;
  sensitivity: TopicSensitivity;
  suggestedStanceMode: SuggestedStanceMode;
  tags: string[];
  wheelTag: string;
}

export interface TopicSelection {
  topic: Topic;
  categoryChoice: TopicCategoryChoice;
  topicIndex: number;
  wheelRotationDegrees: number;
}
