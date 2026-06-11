"use client";

import { useEffect, useRef, useState } from "react";
import type { DurationSeconds, Topic } from "../../types/topic";

interface PrepCountdownProps {
  topic: Topic;
  durationSeconds: DurationSeconds;
  seconds: number;
  onComplete: () => void;
}

const tips = [
  "Open with a clear stance.",
  "Give one strong reason first.",
  "Avoid filler. Pause instead.",
  "Use one concrete example.",
  "End with a memorable final line.",
];

export function PrepCountdown({ topic, durationSeconds, seconds, onComplete }: PrepCountdownProps) {
  const [remaining, setRemaining] = useState(seconds);
  const completedRef = useRef(false);

  useEffect(() => {
    setRemaining(seconds);
    completedRef.current = false;
  }, [seconds, topic.id]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setRemaining((current) => {
        if (current <= 1) {
          window.clearInterval(interval);

          if (!completedRef.current) {
            completedRef.current = true;
            window.setTimeout(onComplete, 250);
          }

          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [onComplete]);

  return (
    <section className="mt-5 rounded-lg border border-[#FFB000] bg-[#0B0506] p-5 text-center">
      <div className="text-sm font-semibold text-[#FFB000]">Prepare your opening.</div>
      <h2 className="mt-2 text-2xl font-semibold text-white">Recording starts soon.</h2>
      <div className="mx-auto mt-5 grid h-28 w-28 place-items-center rounded-lg border border-[#4A1B22] bg-[#18090B] text-6xl font-semibold tabular-nums text-white">
        {remaining}
      </div>
      <div className="mt-5 rounded-md border border-[#3A151B] bg-[#18090B] p-4 text-left">
        <h3 className="text-xl font-semibold text-white">{topic.title}</h3>
        <p className="mt-2 text-sm text-[#D9A7AF]">{durationSeconds / 60} minute speech</p>
      </div>
      <p className="mt-4 text-sm text-[#D9A7AF]">{tips[Math.min(tips.length - 1, seconds - remaining)]}</p>
    </section>
  );
}
