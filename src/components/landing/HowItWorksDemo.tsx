"use client";

import { useEffect, useState } from "react";
import type { ScoreKey } from "../../lib/scoring/calculateScores";
import { SCORE_LABELS, SCORE_WEIGHTS } from "../../lib/scoring/calculateScores";

type DemoStep = {
  id: string;
  label: string;
  title: string;
  description: string;
};

const demoSteps: DemoStep[] = [
  {
    id: "spin",
    label: "Spin",
    title: "The wheel chooses the fight.",
    description: "General, Irish, School, or a wildcard round. The topic locks once the wheel stops.",
  },
  {
    id: "topic",
    label: "Topic",
    title: "A debate prompt lands.",
    description: "Should school uniforms be mandatory? Pick a stance quickly and start shaping the argument.",
  },
  {
    id: "record",
    label: "Speak",
    title: "The clock starts.",
    description: "One, two, or five minutes. No re-record safety net. Train the voice you actually used.",
  },
  {
    id: "analysis",
    label: "Judge",
    title: "AI reviews the attempt.",
    description: "Nine categories are scored, weighted, and then capped by relevance before the final mark is set.",
  },
  {
    id: "score",
    label: "Score",
    title: "Your result hits the board.",
    description: "Score: 84/100. ELO: +27. Strong structure, sharper conclusion needed.",
  },
];

const demoScoreKeys: ScoreKey[] = ["relevance", "argumentQuality", "clarity", "structure"];

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    function handleChange() {
      setPrefersReducedMotion(mediaQuery.matches);
    }

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}

function WheelPanel({ isActive }: { isActive: boolean }) {
  return (
    <div className="grid gap-4 sm:grid-cols-[220px_1fr] sm:items-center">
      <div className="relative mx-auto h-48 w-48">
        <div
          className={[
            "demo-wheel absolute inset-0 rounded-full border border-arena-redDark",
            isActive ? "demo-wheel-active" : "",
          ].join(" ")}
        />
        <div className="absolute inset-8 rounded-full border border-arena-border bg-arena-background" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-md border border-arena-redDark bg-arena-background px-3 py-2 text-sm font-semibold text-white">
            SPIN
          </div>
        </div>
        <div className="absolute -right-1 top-1/2 h-0 w-0 -translate-y-1/2 border-y-[10px] border-l-[18px] border-y-transparent border-l-arena-gold" />
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        {["General", "Irish", "School", "Wildcard"].map((item) => (
          <div key={item} className="rounded-md border border-arena-border bg-arena-elevated px-3 py-2 text-white">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function TopicPanel() {
  return (
    <div className="rounded-lg border border-arena-redDark bg-arena-background p-5">
      <div className="text-sm text-arena-gold">Selected topic</div>
      <h3 className="mt-3 text-2xl font-semibold text-white">Should school uniforms be mandatory?</h3>
      <p className="mt-3 text-sm leading-6 text-arena-textMuted">
        Give a balanced argument, then take a clear stance before the timer burns through your confidence.
      </p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        {["School", "Beginner", "Either stance", "2 minutes"].map((tag) => (
          <span key={tag} className="rounded-md border border-arena-border px-2 py-1 text-arena-textMuted">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function RecordPanel({ isActive }: { isActive: boolean }) {
  return (
    <div className="rounded-lg border border-arena-border bg-arena-background p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-sm text-arena-gold">Recording speech</div>
          <div className="mt-2 text-5xl font-semibold tabular-nums text-white">01:47</div>
        </div>
        <div className="rounded-md border border-arena-redDark px-3 py-2 text-sm text-arena-textMuted">
          LIVE
        </div>
      </div>
      <div className="mt-6 flex h-16 items-end gap-2" aria-hidden="true">
        {Array.from({ length: 18 }, (_, index) => (
          <span
            key={index}
            className={[
              "demo-wave-bar w-full rounded-sm bg-arena-red",
              isActive ? "" : "[animation-play-state:paused]",
            ].join(" ")}
            style={{ animationDelay: `${index * 80}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

function AnalysisPanel({ isActive }: { isActive: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-arena-border bg-arena-background p-5">
      <div
        className={[
          "demo-scan absolute inset-x-0 top-0 h-20 bg-[linear-gradient(180deg,rgba(255,30,60,0),rgba(255,30,60,0.22),rgba(255,30,60,0))]",
          isActive ? "" : "hidden",
        ].join(" ")}
        aria-hidden="true"
      />
      <div className="relative">
        <div className="text-sm text-arena-gold">AI judging panel</div>
        <h3 className="mt-2 text-2xl font-semibold text-white">Analysing delivery...</h3>
        <div className="mt-5 grid gap-2">
          {demoScoreKeys.map((key, index) => (
            <div key={key} className="rounded-md border border-arena-border bg-arena-elevated p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white">{SCORE_LABELS[key]}</span>
                <span className="text-arena-textMuted">{Math.round(SCORE_WEIGHTS[key] * 100)}% weight</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-sm bg-arena-border">
                <div className="h-full rounded-sm bg-arena-red" style={{ width: `${72 + index * 3}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ScorePanel() {
  return (
    <div className="grid gap-4 sm:grid-cols-[180px_1fr]">
      <div className="rounded-lg border border-arena-redDark bg-arena-background p-5 text-center">
        <div className="text-sm text-arena-textMuted">Score</div>
        <div className="mt-2 text-6xl font-semibold text-white">84</div>
        <div className="mt-1 text-sm text-arena-textMuted">out of 100</div>
      </div>
      <div className="rounded-lg border border-arena-border bg-arena-background p-5">
        <div className="text-sm text-arena-gold">ELO +27</div>
        <h3 className="mt-2 text-2xl font-semibold text-white">Silver rank pressure rising.</h3>
        <p className="mt-3 text-sm leading-6 text-arena-textMuted">
          Strong structure, clear relevance, sharper conclusion needed. Next drill: land one final sentence without drifting.
        </p>
      </div>
    </div>
  );
}

function DemoVisual({ step, isActive }: { step: DemoStep; isActive: boolean }) {
  if (step.id === "spin") return <WheelPanel isActive={isActive} />;
  if (step.id === "topic") return <TopicPanel />;
  if (step.id === "record") return <RecordPanel isActive={isActive} />;
  if (step.id === "analysis") return <AnalysisPanel isActive={isActive} />;
  return <ScorePanel />;
}

export function HowItWorksDemo() {
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();
  const activeStep = demoSteps[activeIndex];

  useEffect(() => {
    if (prefersReducedMotion) return;

    const interval = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % demoSteps.length);
    }, 2800);

    return () => window.clearInterval(interval);
  }, [prefersReducedMotion]);

  return (
    <section className="border-b border-arena-border bg-arena-background">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <h2 className="text-3xl font-semibold text-white sm:text-5xl">Spin. Speak. Survive the Score.</h2>
          <p className="mt-5 text-base leading-7 text-arena-textMuted">
            A tiny arena for your voice. Get a topic, speak under pressure, and let the AI judge your delivery without
            pretending your waffle was strategy.
          </p>
          <div className="mt-6 grid gap-2">
            {demoSteps.map((step, index) => (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={[
                  "rounded-md border px-4 py-3 text-left transition-colors",
                  activeIndex === index
                    ? "border-arena-red bg-arena-surface text-white"
                    : "border-arena-border bg-transparent text-arena-textMuted hover:border-arena-redDark hover:text-white",
                ].join(" ")}
                aria-current={activeIndex === index ? "step" : undefined}
              >
                <span className="text-sm font-semibold">{step.label}</span>
                <span className="mt-1 block text-sm">{step.title}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-arena-border bg-arena-surface p-4">
          <div className="rounded-md border border-arena-border bg-arena-elevated p-3">
            <div className="flex items-center justify-between gap-4 border-b border-arena-border pb-3">
              <div className="font-semibold text-white">Oratorium live demo</div>
              <div className="text-sm text-arena-gold">{activeStep.label}</div>
            </div>
            <div className="min-h-[330px] py-5">
              <DemoVisual step={activeStep} isActive={!prefersReducedMotion} />
            </div>
            <div className="border-t border-arena-border pt-3">
              <h3 className="text-xl font-semibold text-white">{activeStep.title}</h3>
              <p className="mt-2 text-sm leading-6 text-arena-textMuted">{activeStep.description}</p>
              <div className="mt-4 flex gap-2" aria-label="Demo progress">
                {demoSteps.map((step, index) => (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={[
                      "h-2 rounded-sm transition-colors",
                      activeIndex === index ? "w-8 bg-arena-red" : "w-4 bg-arena-border hover:bg-arena-redDark",
                    ].join(" ")}
                    aria-label={`Show ${step.label} step`}
                    aria-current={activeIndex === index ? "step" : undefined}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
