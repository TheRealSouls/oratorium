import { describe, expect, it } from "vitest";
import {
  MAX_ELO,
  MIN_ELO,
  calculateElo,
  expectedScoreForElo,
  getKFactor,
  getRankTitle,
} from "./calculateElo";

describe("expectedScoreForElo", () => {
  it("requires higher scores as ELO rises", () => {
    expect(expectedScoreForElo(350)).toBe(35);
    expect(expectedScoreForElo(650)).toBe(45);
    expect(expectedScoreForElo(950)).toBe(55);
    expect(expectedScoreForElo(1250)).toBe(65);
    expect(expectedScoreForElo(1550)).toBe(75);
    expect(expectedScoreForElo(1850)).toBe(82);
    expect(expectedScoreForElo(2150)).toBe(88);
    expect(expectedScoreForElo(2400)).toBe(93);
  });
});

describe("getKFactor", () => {
  it("reduces volatility as attempts increase", () => {
    expect(getKFactor(0)).toBe(90);
    expect(getKFactor(5)).toBe(70);
    expect(getKFactor(15)).toBe(50);
    expect(getKFactor(30)).toBe(35);
  });
});

describe("getRankTitle", () => {
  it("maps ELO ranges to rank titles", () => {
    expect(getRankTitle(200)).toBe("Novice");
    expect(getRankTitle(500)).toBe("Bronze");
    expect(getRankTitle(800)).toBe("Silver");
    expect(getRankTitle(1100)).toBe("Gold");
    expect(getRankTitle(1400)).toBe("Platinum");
    expect(getRankTitle(1700)).toBe("Diamond");
    expect(getRankTitle(2000)).toBe("Master");
    expect(getRankTitle(2300)).toBe("Grandmaster");
  });
});

describe("calculateElo", () => {
  it("gives a low-rated user rating for a good score", () => {
    const result = calculateElo({
      currentElo: 650,
      overallScore: 70,
      topicDifficulty: "intermediate",
      durationSeconds: 120,
      attemptCount: 3,
    });

    expect(result.expectedScore).toBe(45);
    expect(result.change).toBe(23);
    expect(result.eloAfter).toBe(673);
  });

  it("makes a high-rated user lose rating for a mediocre score", () => {
    const result = calculateElo({
      currentElo: 1800,
      overallScore: 60,
      topicDifficulty: "intermediate",
      durationSeconds: 120,
      attemptCount: 20,
    });

    expect(result.expectedScore).toBe(82);
    expect(result.change).toBe(-11);
    expect(result.eloAfter).toBe(1789);
  });

  it("gives smaller changes for beginner topics", () => {
    const beginner = calculateElo({
      currentElo: 800,
      overallScore: 75,
      topicDifficulty: "beginner",
      durationSeconds: 120,
      attemptCount: 3,
    });
    const advanced = calculateElo({
      currentElo: 800,
      overallScore: 75,
      topicDifficulty: "advanced",
      durationSeconds: 120,
      attemptCount: 3,
    });

    expect(beginner.change).toBeLessThan(advanced.change);
  });

  it("gives larger changes for five-minute speeches", () => {
    const oneMinute = calculateElo({
      currentElo: 800,
      overallScore: 75,
      topicDifficulty: "intermediate",
      durationSeconds: 60,
      attemptCount: 3,
    });
    const fiveMinutes = calculateElo({
      currentElo: 800,
      overallScore: 75,
      topicDifficulty: "intermediate",
      durationSeconds: 300,
      attemptCount: 3,
    });

    expect(oneMinute.change).toBeLessThan(fiveMinutes.change);
  });

  it("stabilises experienced users", () => {
    const newUser = calculateElo({
      currentElo: 800,
      overallScore: 80,
      topicDifficulty: "intermediate",
      durationSeconds: 120,
      attemptCount: 1,
    });
    const experiencedUser = calculateElo({
      currentElo: 800,
      overallScore: 80,
      topicDifficulty: "intermediate",
      durationSeconds: 120,
      attemptCount: 40,
    });

    expect(newUser.change).toBeGreaterThan(experiencedUser.change);
  });

  it("uses consistency as a small multiplier", () => {
    const inconsistent = calculateElo({
      currentElo: 800,
      overallScore: 80,
      topicDifficulty: "intermediate",
      durationSeconds: 120,
      attemptCount: 10,
      consistencyScore: 20,
    });
    const consistent = calculateElo({
      currentElo: 800,
      overallScore: 80,
      topicDifficulty: "intermediate",
      durationSeconds: 120,
      attemptCount: 10,
      consistencyScore: 90,
    });

    expect(inconsistent.change).toBeLessThan(consistent.change);
  });

  it("clamps ELO between 200 and 2500", () => {
    expect(
      calculateElo({
        currentElo: 199,
        overallScore: 0,
        topicDifficulty: "intermediate",
        durationSeconds: 120,
        attemptCount: 1,
      }).eloAfter
    ).toBe(MIN_ELO);

    expect(
      calculateElo({
        currentElo: 2499,
        overallScore: 100,
        topicDifficulty: "advanced",
        durationSeconds: 300,
        attemptCount: 1,
      }).eloAfter
    ).toBe(MAX_ELO);
  });
});
