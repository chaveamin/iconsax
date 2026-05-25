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
        {MODES.map((mode) => (
          <button
            key={mode}
            onClick={() => onModeChange(mode)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 capitalize ${
              selectedMode === mode
                ? "bg-teal-500/20 text-teal-300 ring-1 ring-teal-500/50"
                : "bg-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700"
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* Style picker with mini previews */}
      <div className="flex flex-col gap-y-4">
        {STYLES.map((style) => {
          const variantPath = getVariantPath(
            icon,
            allIcons,
            selectedMode,
            style,
          );
          return (
            <button
              key={style}
              onClick={() => onStyleChange(style)}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-150 cursor-pointer ${
                selectedStyle === style
                  ? "border-teal-400 bg-teal-500/10 ring-1 ring-teal-500/30"
                  : "border-zinc-100/15 bg-zinc-800/40 hover:border-zinc-600 hover:bg-zinc-800/80"
              }`}
            >
              <img
                src={variantPath ? variantPath : undefined}
                alt={`${style} style`}
                className="size-6 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.opacity = "0.2";
                }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
