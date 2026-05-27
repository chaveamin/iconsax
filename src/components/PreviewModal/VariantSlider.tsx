import { IconMeta } from "../../types";
import { MODES, STYLES, Mode, Style } from "./types";

interface VariantSidebarProps {
  icon: IconMeta;
  selectedMode: Mode;
  selectedStyle: Style;
  allIcons: IconMeta[];
  onModeChange: (mode: Mode) => void;
  onStyleChange: (style: Style) => void;
}

function getVariantPath(
  icon: IconMeta,
  allIcons: IconMeta[],
  mode: string,
  style: string,
): string {
  const baseName = icon.name.split("_")[0];
  const match = allIcons.find(
    (i) =>
      i.name.split("_")[0] === baseName &&
      i.category === icon.category &&
      i.mode === mode &&
      i.style === style,
  );
  return match ? match.path : "";
}

function isModeAvailable(
  icon: IconMeta,
  allIcons: IconMeta[],
  mode: string,
): boolean {
  const baseName = icon.name.split("_")[0];
  return allIcons.some(
    (i) =>
      i.name.split("_")[0] === baseName &&
      i.category === icon.category &&
      i.mode === mode,
  );
}

function isStyleAvailable(
  icon: IconMeta,
  allIcons: IconMeta[],
  mode: string,
  style: string,
): boolean {
  return getVariantPath(icon, allIcons, mode, style) !== "";
}

export function VariantSidebar({
  icon,
  selectedMode,
  selectedStyle,
  allIcons,
  onModeChange,
  onStyleChange,
}: VariantSidebarProps) {
  return (
    <div className="flex flex-col items-center gap-6 pr-5 w-[10%]">
      {/* Mode picker */}
      <div className="flex flex-col gap-y-2">
        {MODES.map((mode) => {
          const available = isModeAvailable(icon, allIcons, mode);
          const isSelected = selectedMode === mode;
          return (
            <button
              key={mode}
              onClick={() => available && onModeChange(mode)}
              disabled={!available}
              title={!available ? "Not available" : undefined}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 capitalize
                ${
                  isSelected && available
                    ? "bg-teal-500/20 text-teal-300 ring-1 ring-teal-500/50"
                    : available
                      ? "bg-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700"
                      : "bg-zinc-800/40 text-zinc-600 cursor-not-allowed line-through decoration-zinc-600"
                }`}
            >
              {mode}
            </button>
          );
        })}
      </div>

      {/* Style picker with mini previews */}
      <div className="flex flex-col gap-y-4">
        {STYLES.map((style) => {
          const available = isStyleAvailable(
            icon,
            allIcons,
            selectedMode,
            style,
          );
          const isSelected = selectedStyle === style;
          const variantPath = available
            ? getVariantPath(icon, allIcons, selectedMode, style)
            : "";
          return (
            <button
              key={style}
              onClick={() => available && onStyleChange(style)}
              disabled={!available}
              title={available ? style : "Not available"}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-150
                ${
                  isSelected && available
                    ? "border-teal-400 bg-teal-500/10 ring-1 ring-teal-500/30 cursor-pointer"
                    : available
                      ? "border-zinc-100/15 bg-zinc-800/40 hover:border-zinc-600 hover:bg-zinc-800/80 cursor-pointer"
                      : "border-zinc-800/50 bg-zinc-800/20 cursor-not-allowed"
                }`}
            >
              {available ? (
                <img
                  src={variantPath}
                  alt={`${style} style`}
                  className="size-6 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.opacity = "0.2";
                  }}
                />
              ) : (
                <span className="size-6 flex items-center justify-center text-zinc-600">
                  <svg
                    className="size-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                    />
                  </svg>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
