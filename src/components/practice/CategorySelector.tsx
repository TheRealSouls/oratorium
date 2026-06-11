import type { TopicCategoryChoice } from "../../types/topic";

const categoryOptions: { value: TopicCategoryChoice; label: string }[] = [
  { value: "general", label: "General" },
  { value: "irish", label: "Irish" },
  { value: "school", label: "School" },
  { value: "fun", label: "Fun" },
  { value: "mixed", label: "Mixed" },
];

interface CategorySelectorProps {
  value: TopicCategoryChoice;
  disabled: boolean;
  onChange: (value: TopicCategoryChoice) => void;
}

export function CategorySelector({ value, disabled, onChange }: CategorySelectorProps) {
  return (
    <div>
      <label className="text-sm font-medium text-[#FFF7F8]">Category</label>
      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {categoryOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            disabled={disabled}
            className={[
              "rounded-md border px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed",
              value === option.value
                ? "border-[#FF1E3C] bg-[#FF1E3C] text-white"
                : "border-[#4A1B22] bg-[#240D10] text-[#D9A7AF] hover:border-[#FF5A6E] hover:text-white",
            ].join(" ")}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
