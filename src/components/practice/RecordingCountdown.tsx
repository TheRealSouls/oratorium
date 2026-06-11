interface RecordingCountdownProps {
  countdown: number;
}

export function RecordingCountdown({ countdown }: RecordingCountdownProps) {
  return (
    <div className="text-center">
      <div className="text-sm text-[#D9A7AF]">Mic check. Then it&apos;s your stage.</div>
      <div className="mt-2 text-6xl font-semibold tabular-nums text-[#FFB000]">{countdown}</div>
    </div>
  );
}
