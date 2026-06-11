import { describe, expect, it } from "vitest";
import { calculateScores } from "./calculateScores";

describe("calculateScores", () => {
  it("returns 100 for perfect scores", () => {
    expect(
      calculateScores({
        relevance: 100,
        clarity: 100,
        structure: 100,
        tone: 100,
        confidence: 100,
        pacing: 100,
        evocativeness: 100,
        argumentQuality: 100,
        conclusion: 100,
      })
    ).toEqual({
      uncappedScores: {
        relevance: 100,
        clarity: 100,
        structure: 100,
        tone: 100,
        confidence: 100,
        pacing: 100,
        evocativeness: 100,
        argumentQuality: 100,
        conclusion: 100,
      },
      cappedScores: {
        relevance: 100,
        clarity: 100,
        structure: 100,
        tone: 100,
        confidence: 100,
        pacing: 100,
        evocativeness: 100,
        argumentQuality: 100,
        conclusion: 100,
      },
      overallScore: 100,
      capApplied: false,
    });
  });

  it("caps every score at 0 when relevance is 0", () => {
    const result = calculateScores({
      relevance: 0,
      clarity: 90,
      structure: 90,
      tone: 90,
      confidence: 90,
      pacing: 90,
      evocativeness: 90,
      argumentQuality: 90,
      conclusion: 90,
    });

    expect(result.cappedScores).toEqual({
      relevance: 0,
      clarity: 0,
      structure: 0,
      tone: 0,
      confidence: 0,
      pacing: 0,
      evocativeness: 0,
      argumentQuality: 0,
      conclusion: 0,
    });
    expect(result.overallScore).toBe(0);
    expect(result.capApplied).toBe(true);
  });

  it("caps high category scores at relevance 15", () => {
    const result = calculateScores({
      relevance: 15,
      clarity: 80,
      structure: 75,
      tone: 90,
      confidence: 85,
      pacing: 70,
      evocativeness: 95,
      argumentQuality: 88,
      conclusion: 65,
    });

    expect(result.cappedScores).toEqual({
      relevance: 15,
      clarity: 15,
      structure: 15,
      tone: 15,
      confidence: 15,
      pacing: 15,
      evocativeness: 15,
      argumentQuality: 15,
      conclusion: 15,
    });
    expect(result.overallScore).toBe(15);
    expect(result.capApplied).toBe(true);
  });

  it("clamps negative, invalid, missing, and above-range scores", () => {
    const result = calculateScores({
      relevance: 120,
      clarity: -20,
      structure: Number.NaN,
      tone: "90",
      confidence: Infinity,
      pacing: 45.4,
      evocativeness: 101,
    });

    expect(result.uncappedScores).toEqual({
      relevance: 100,
      clarity: 0,
      structure: 0,
      tone: 0,
      confidence: 0,
      pacing: 45.4,
      evocativeness: 100,
      argumentQuality: 0,
      conclusion: 0,
    });
    expect(result.cappedScores).toEqual(result.uncappedScores);
    expect(result.overallScore).toBe(37);
  });

  it("calculates the weighted overall from capped scores", () => {
    const result = calculateScores({
      relevance: 80,
      clarity: 70,
      structure: 60,
      tone: 50,
      confidence: 40,
      pacing: 30,
      evocativeness: 20,
      argumentQuality: 10,
      conclusion: 0,
    });

    expect(result.overallScore).toBe(48);
  });

  it("treats completely missing scores as 0", () => {
    expect(calculateScores()).toEqual({
      uncappedScores: {
        relevance: 0,
        clarity: 0,
        structure: 0,
        tone: 0,
        confidence: 0,
        pacing: 0,
        evocativeness: 0,
        argumentQuality: 0,
        conclusion: 0,
      },
      cappedScores: {
        relevance: 0,
        clarity: 0,
        structure: 0,
        tone: 0,
        confidence: 0,
        pacing: 0,
        evocativeness: 0,
        argumentQuality: 0,
        conclusion: 0,
      },
      overallScore: 0,
      capApplied: false,
    });
  });
});
