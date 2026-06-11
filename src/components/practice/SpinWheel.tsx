import { useMemo } from "react";
import type { Topic } from "../../types/topic";

interface SpinWheelProps {
  topics: Topic[];
  isSpinning: boolean;
  resultIndex?: number;
  rotationDegrees: number;
}

export function SpinWheel({ topics, isSpinning, resultIndex, rotationDegrees }: SpinWheelProps) {
  const segmentDegrees = topics.length ? 360 / topics.length : 360;
  const wheelBackground = useMemo(() => {
    if (!topics.length) return "#240D10";

    const colors = ["#FF1E3C", "#B80F27", "#240D10", "#6B101B"];

    return `conic-gradient(${topics
      .map((_, index) => {
        const start = index * segmentDegrees;
        const end = start + segmentDegrees;
        return `${colors[index % colors.length]} ${start}deg ${end}deg`;
      })
      .join(", ")})`;
  }, [segmentDegrees, topics]);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[380px]">
      <div className="absolute left-1/2 top-0 z-10 h-0 w-0 -translate-x-1/2 border-l-[14px] border-r-[14px] border-t-[24px] border-l-transparent border-r-transparent border-t-[#FFB000]" />
      {!isSpinning && resultIndex !== undefined && (
        <div
          className="pointer-events-none absolute inset-[-6px] rounded-full border-2 border-[#FFB000] opacity-70"
          style={{ transform: `rotate(${resultIndex * segmentDegrees}deg)` }}
        />
      )}
      <div
        className="relative h-full w-full rounded-full border-4 border-[#FFB000] transition-transform duration-[2600ms] ease-out"
        style={{
          transform: `rotate(${rotationDegrees}deg)`,
          background: wheelBackground,
        }}
      >
        <div className="absolute inset-0 grid place-items-center">
          <div className="grid h-32 w-32 place-items-center rounded-full border border-[#FF5A6E] bg-[#0B0506] p-3 text-center text-sm font-semibold text-[#FFF7F8]">
            {isSpinning ? "Drawing" : resultIndex !== undefined ? "Locked" : "Spin"}
          </div>
        </div>
      </div>
    </div>
  );
}
