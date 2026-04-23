import { Checkbox } from "@headlessui/react";
import { IconMeta } from "../types";
import { getDisplayName } from "../lib/utils";

interface IconCardProps {
  icon: IconMeta;
  isSelected: boolean;
  onToggle: () => void;
  onClick: (e: React.MouseEvent) => void;
  onPreview: () => void;
}

export function IconCard({
  icon,
  isSelected,
  onToggle,
  onClick,
  onPreview,
}: IconCardProps) {
  return (
    <div
      data-icon-card
      data-path={icon.path}
      className={`group relative bg-zinc-900/50 backdrop-blur-sm border rounded-2xl p-5 flex flex-col items-center cursor-pointer transition-all duration-200
        ${isSelected ? "border-zinc-400 ring-2 ring-zinc-500/50 bg-zinc-800/80" : "border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/40"}`}
      onClick={onClick}
    >
      <div
        className="size-14 flex items-center justify-center transition-transform duration-200"
        onClick={(e) => {
          e.stopPropagation();
          onPreview();
        }}
      >
        <img src={icon.path} alt={icon.name} className="w-10" />
      </div>
      <span className="text-xs font-medium text-zinc-300 text-center truncate w-full">
        {getDisplayName(icon.name)}
      </span>

      <Checkbox
        checked={isSelected}
        onChange={onToggle}
        className="absolute top-3 right-3"
      >
        {({ checked }) => (
          <div
            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${checked ? "bg-zinc-100 border-zinc-100" : "border-zinc-600 group-hover:border-zinc-400"}`}
          >
            {checked && (
              <svg
                className="size-3.5 text-zinc-900"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        )}
      </Checkbox>
    </div>
  );
}
