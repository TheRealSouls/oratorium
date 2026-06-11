import type { Topic, TopicCategory, TopicCategoryChoice, TopicSelection } from "../../types/topic";
import { funTopics } from "./fun";
import { generalTopics } from "./general";
import { irishTopics } from "./irish";
import { schoolTopics } from "./school";

export const topicsByCategory: Record<TopicCategory, Topic[]> = {
  general: generalTopics,
  irish: irishTopics,
  school: schoolTopics,
  fun: funTopics,
};

const allTopics = [...generalTopics, ...irishTopics, ...schoolTopics, ...funTopics];

function shuffled<T>(items: T[], random: () => number) {
  const nextItems = [...items];

  for (let index = nextItems.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [nextItems[index], nextItems[swapIndex]] = [nextItems[swapIndex], nextItems[index]];
  }

  return nextItems;
}

export function getTopicsForCategory(categoryChoice: TopicCategoryChoice) {
  if (categoryChoice === "mixed") {
    return allTopics;
  }

  return topicsByCategory[categoryChoice];
}

export function getTopicsInPlay(categoryChoice: TopicCategoryChoice, random = Math.random, maxTopics = 12) {
  if (categoryChoice !== "mixed") {
    return shuffled(getTopicsForCategory(categoryChoice), random).slice(0, maxTopics);
  }

  const categories = Object.values(topicsByCategory);
  const perCategory = Math.max(1, Math.floor(maxTopics / categories.length));
  const balancedTopics = categories.flatMap((topics) => shuffled(topics, random).slice(0, perCategory));
  const remainingSlots = maxTopics - balancedTopics.length;
  const remainingTopics = shuffled(
    allTopics.filter((topic) => !balancedTopics.some((selectedTopic) => selectedTopic.id === topic.id)),
    random
  ).slice(0, remainingSlots);

  return shuffled([...balancedTopics, ...remainingTopics], random);
}

export function getTopicById(topicId: string) {
  return allTopics.find((topic) => topic.id === topicId);
}

export function selectRandomTopic(
  categoryChoice: TopicCategoryChoice,
  random = Math.random,
  topicsOverride?: Topic[]
): TopicSelection {
  const topics = topicsOverride ?? getTopicsForCategory(categoryChoice);
  const topicIndex = Math.min(topics.length - 1, Math.max(0, Math.floor(random() * topics.length)));
  const segmentDegrees = 360 / topics.length;

  return {
    topic: topics[topicIndex],
    categoryChoice,
    topicIndex,
    wheelRotationDegrees: 1440 + (topics.length - topicIndex) * segmentDegrees - segmentDegrees / 2,
  };
}
