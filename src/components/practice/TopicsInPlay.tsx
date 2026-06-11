import type { Topic } from "../../types/topic";

interface TopicsInPlayProps {
  topics: Topic[];
  selectedTopicId?: string;
}

export function TopicsInPlay({ topics, selectedTopicId }: TopicsInPlayProps) {
  if (!topics.length) {
    return (
      <div className="rounded-md border border-[#3A151B] bg-[#240D10] p-4 text-sm text-[#D9A7AF]">
        No topics are available for this category yet.
      </div>
    );
  }

  return (
    <div className="mt-3 grid max-h-60 gap-2 overflow-auto pr-1">
      {topics.map((topic) => {
        const isSelected = selectedTopicId === topic.id;

        return (
          <div
            key={topic.id}
            className={[
              "rounded-md border px-3 py-2 text-sm",
              isSelected
                ? "border-[#FFB000] bg-[#2B1607] text-white"
                : "border-[#3A151B] bg-[#240D10] text-[#D9A7AF]",
            ].join(" ")}
          >
            <div className="font-medium leading-6 text-[#FFF7F8]">{topic.title}</div>
          </div>
        );
      })}
    </div>
  );
}
