import type { DurationSeconds } from "../../types/topic";

const durations: DurationSeconds[] = [60, 120, 300];

interface DurationSelectorProps {
  value: DurationSeconds;
  disabled?: boolean;
  onChange: (value: DurationSeconds) => void;
}

export function DurationSelector({ value, disabled = false, onChange }: DurationSelectorProps) {
  return (
    <div>
      <label className="text-sm font-medium text-[#FFF7F8]">Duration</label>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {durations.map((duration) => (
          <button
            key={duration}
            type="button"
            onClick={() => onChange(duration)}
            disabled={disabled}
            className={[
              "rounded-md border px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed",
              value === duration
                ? "border-[#FFB000] bg-[#FFB000] text-[#1A090B]"
                : "border-[#4A1B22] bg-[#240D10] text-[#D9A7AF] hover:border-[#FFB000] hover:text-white",
            ].join(" ")}
          >
            {duration / 60}m
          </button>
        ))}
      </div>
    </div>
  );
}
