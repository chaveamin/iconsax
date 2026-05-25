import { FRAMEWORKS, Framework } from "./types";

interface FrameworkTabsProps {
  selected: Framework;
  onChange: (fw: Framework) => void;
}

export function FrameworkTabs({ selected, onChange }: FrameworkTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {FRAMEWORKS.map((fw) => (
        <button
          key={fw.id}
          onClick={() => onChange(fw.id)}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
            selected === fw.id
              ? "bg-teal-500/20 text-teal-300 ring-1 ring-teal-500/50"
              : "bg-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700"
          }`}
        >
          {fw.label}
        </button>
      ))}
    </div>
  );
}
