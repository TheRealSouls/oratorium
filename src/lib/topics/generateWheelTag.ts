const stopWords = new Set([
  "a",
  "an",
  "and",
  "are",
  "be",
  "by",
  "does",
  "for",
  "have",
  "in",
  "is",
  "it",
  "of",
  "or",
  "should",
  "the",
  "to",
]);

export function generateWheelTag(title: string) {
  const words = title
    .replace(/[^\w\s-]/g, "")
    .split(/\s+/)
    .filter((word) => word && !stopWords.has(word.toLowerCase()))
    .slice(0, 3);

  return (words.length ? words : title.split(/\s+/).slice(0, 2)).join(" ").toUpperCase();
}
