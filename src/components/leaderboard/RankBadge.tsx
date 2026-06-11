import type { RankTitle } from "../../lib/scoring/calculateElo";

const rankColors: Record<RankTitle, string> = {
  Novice: "#8E6B71",
  Bronze: "#CD7F32",
  Silver: "#C0C0C0",
  Gold: "#FFB000",
  Platinum: "#20C997",
  Diamond: "#78E4D1",
  Master: "#FF5A6E",
  Grandmaster: "#FFF7F8",
};

interface RankBadgeProps {
  rank: RankTitle;
  className?: string;
}

export function RankBadge({ rank, className = "" }: RankBadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-md border border-[#4A1B22] px-2 py-1 text-xs font-medium text-[#D9A7AF]",
        className,
      ].join(" ")}
    >
      <span
        className="h-2.5 w-2.5 shrink-0 rounded-full"
        style={{ backgroundColor: rankColors[rank] }}
        aria-hidden="true"
      />
      {rank}
    </span>
  );
}
