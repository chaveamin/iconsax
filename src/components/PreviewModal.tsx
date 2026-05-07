import { IconMeta } from "../types";
import { getDisplayName } from "../lib/utils";
import { useState, useEffect } from "react";

interface PreviewModalProps {
  icon: IconMeta | null;
  isOpen: boolean;
  svgContent: string;
  onClose: () => void;
  onCopy: () => void;
  allIcons: IconMeta[];
}

const MODES = ["straight", "rounded"] as const;
const STYLES = [
  "bold",
  "broken",
  "bulk",
  "linear",
  "outline",
  "twotone",
] as const;

type Mode = (typeof MODES)[number];
type Style = (typeof STYLES)[number];

export function PreviewModal({
  icon,
  isOpen,
  svgContent,
  onClose,
  onCopy,
  allIcons,
}: PreviewModalProps) {
  const [selectedMode, setSelectedMode] = useState<Mode>("straight");
  const [selectedStyle, setSelectedStyle] = useState<Style>("bold");
  const [activeSvg, setActiveSvg] = useState(svgContent);
  const [loadingVariant, setLoadingVariant] = useState(false);
  const getVariantPath = (mode: string, style: string): string => {
    if (!icon) return "";
    const baseName = icon.name.split("_")[0];
    const match = allIcons.find(
      (i) =>
        i.name.split("_")[0] === baseName &&
        i.category === icon.category &&
        i.mode === mode &&
        i.style === style,
    );
    return match ? match.path : "";
  };

  // Sync initial mode/style from the icon that was clicked
  useEffect(() => {
    if (icon) {
      setSelectedMode(icon.mode as Mode);
      setSelectedStyle(icon.style as Style);
    }
  }, [icon]);

  // Fetch SVG whenever mode/style/icon changes
  useEffect(() => {
    if (!icon) return;
    const baseName = icon.name.split("_")[0];
    const match = allIcons.find(
      (i) =>
        i.name.split("_")[0] === baseName &&
        i.category === icon.category &&
        i.mode === selectedMode &&
        i.style === selectedStyle,
    );
    const path = match?.path;
    if (!path) {
      setActiveSvg("");
      return;
    }
    setLoadingVariant(true);
    fetch(path)
      .then((res) => (res.ok ? res.text() : Promise.reject()))
      .then(setActiveSvg)
      .catch(() => setActiveSvg(""))
      .finally(() => setLoadingVariant(false));
  }, [icon, selectedMode, selectedStyle, allIcons]);

  // Keep activeSvg in sync when parent loads initial svgContent
  useEffect(() => {
    if (svgContent) setActiveSvg(svgContent);
  }, [svgContent]);

  const handleCopy = () => {
    navigator.clipboard.writeText(activeSvg);
    onCopy();
  };

  const activeIconPath = getVariantPath(selectedMode, selectedStyle);

  if (!icon) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-200 ${
        isOpen
          ? "bg-black/70 backdrop-blur-sm"
          : "bg-transparent pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-zinc-900 border border-zinc-700 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl transition-all duration-200 ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800 sticky top-0 bg-zinc-900 z-10 rounded-t-3xl">
          <h3 className="text-lg font-semibold text-zinc-100">
            {getDisplayName(icon.name)}
            <span className="ml-2 text-xs font-normal text-zinc-500">
              {selectedMode} &bull; {icon.category} &bull; {selectedStyle}
            </span>
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
          >
            <svg
              className="size-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Large preview */}
        <div className="grid-pattern p-6 flex justify-center bg-zinc-950/50 border-b border-zinc-800">
          {loadingVariant ? (
            <div className="lg:w-38 w-30 aspect-square flex items-center justify-center">
              <div className="size-6 rounded-full border-2 border-zinc-600 border-t-teal-400 animate-spin" />
            </div>
          ) : activeSvg ? (
            <img
              src={activeIconPath ? activeIconPath : undefined}
              alt={icon.name}
              className="lg:w-38 w-30"
            />
          ) : (
            <div className="lg:w-38 w-30 aspect-square flex items-center justify-center text-zinc-600 text-xs">
              Not available
            </div>
          )}
        </div>

        <div className="p-5 space-y-5">
          {/* Mode picker */}
          <div>
            <p className="text-xs font-medium text-zinc-400 mb-2.5">Mode</p>
            <div className="flex gap-2">
              {MODES.map((mode) => (
                <button
                  key={mode}
                  onClick={() => setSelectedMode(mode)}
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
          </div>

          {/* Style picker with mini previews */}
          <div>
            <p className="text-xs font-medium text-zinc-400 mb-2.5">Style</p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {STYLES.map((style) => {
                const variantPath = getVariantPath(selectedMode, style);
                return (
                  <button
                    key={style}
                    onClick={() => setSelectedStyle(style)}
                    className={`flex flex-col items-center gap-2 p-2 rounded-xl border transition-all duration-150 cursor-pointer ${
                      selectedStyle === style
                        ? "border-teal-400 bg-teal-500/10 ring-1 ring-teal-500/30"
                        : "border-zinc-100/15 bg-zinc-800/40 hover:border-zinc-600 hover:bg-zinc-800/80"
                    }`}
                  >
                    <img
                      src={variantPath ? variantPath : undefined}
                      alt={`${style} style`}
                      className="w-8 h-8 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.opacity = "0.2";
                      }}
                    />
                    {/* <span
                      className={`text-[10px] font-medium capitalize ${
                        selectedStyle === style
                          ? "text-teal-300"
                          : "text-zinc-500"
                      }`}
                    >
                      {style}
                    </span> */}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SVG Code */}
          <div>
            <p className="text-xs font-medium text-zinc-400 mb-2">SVG Code</p>
            <pre className="icon-svg-code bg-zinc-950 rounded-xl p-4 text-xs text-blue-300 overflow-auto max-h-40 font-jet border border-zinc-800">
              {activeSvg || "// Not available for this combination"}
            </pre>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end p-5 border-t border-zinc-800 sticky bottom-0 bg-zinc-900 rounded-b-3xl">
          <button
            onClick={handleCopy}
            disabled={!activeSvg}
            className="cursor-pointer px-3 py-2.5 bg-zinc-800 text-zinc-200 rounded-xl text-sm font-medium hover:bg-zinc-700 transition-all duration-200 flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            title="Copy SVG code"
          >
            <svg
              className="size-6"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_4482_14841)">
                <path
                  d="M14.4501 2H9.56006C8.45549 2 7.56006 2.89543 7.56006 4V4.44C7.56006 5.54457 8.45549 6.44 9.56006 6.44H14.4501C15.5546 6.44 16.4501 5.54457 16.4501 4.44V4C16.4501 2.89543 15.5546 2 14.4501 2Z"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16.4399 4.21973H16.8799C19.0899 4.21973 20.8799 6.00973 20.8799 8.21973V17.9997C20.8799 20.2097 19.0899 21.9997 16.8799 21.9997H7.10986C4.89986 21.9997 3.10986 20.2097 3.10986 17.9997V8.21973C3.10986 6.00973 4.89986 4.21973 7.10986 4.21973H7.54986"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13.1099 17H15.3299"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.66992 11.4404L10.8899 13.6604L8.66992 15.8804"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_4482_14841">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </button>
          <a
            href={activeSvg ? activeIconPath : undefined}
            download={
              activeSvg
                ? `${getDisplayName(icon.name)}-${selectedMode}-${selectedStyle}.svg`
                : undefined
            }
            aria-disabled={!activeSvg}
            className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              activeSvg
                ? "bg-zinc-100 text-zinc-900 hover:bg-white"
                : "bg-zinc-700 text-zinc-500 pointer-events-none opacity-40"
            }`}
            title="Download SVG"
          >
            <svg
              className="size-6"
              viewBox="0 0 24 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_3247_9481)">
                <path
                  d="M12 4.67969V16.1697"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                />
                <path
                  d="M8.73999 12.9102L12 16.1702L15.26 12.9102"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2.75 15.9902L3.90002 18.8702C4.40002 20.1102 5.89999 21.1302 7.23999 21.1302H16.76C18.1 21.1302 19.6 20.1102 20.1 18.8702L21.25 15.9902"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_3247_9481">
                  <rect
                    width="24"
                    height="24"
                    fill="currentColor"
                    transform="translate(0 0.910156)"
                  />
                </clipPath>
              </defs>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
