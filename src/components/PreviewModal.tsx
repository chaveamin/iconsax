import { IconMeta } from "../types";
import { getDisplayName } from "../lib/utils";
import { useState, useEffect, useMemo } from "react";
import { svgbgIcon } from "./ui/Icons";

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
type Framework = "svg" | "react" | "vue" | "svelte" | "html" | "webcomponent";

const FRAMEWORKS: { id: Framework; label: string; ext: string }[] = [
  { id: "svg", label: "SVG", ext: "svg" },
  { id: "react", label: "React", ext: "jsx" },
  { id: "vue", label: "Vue", ext: "vue" },
  { id: "svelte", label: "Svelte", ext: "svelte" },
  { id: "html", label: "HTML", ext: "html" },
  { id: "webcomponent", label: "Web Component", ext: "js" },
];

// ----- Code generators -----

function getViewBox(svg: string): string {
  return svg.match(/viewBox="([^"]*)"/)?.[1] ?? "0 0 24 24";
}

function getInnerSvg(svg: string): string {
  return svg
    .replace(/<svg[^>]*>/, "")
    .replace(/<\/svg>\s*$/, "")
    .trim();
}

function toComponentName(displayName: string): string {
  return (
    displayName
      .split(/[-_\s]+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join("")
      .replace(/[^a-zA-Z0-9]/g, "") || "Icon"
  );
}

function generateReact(svg: string, displayName: string): string {
  const viewBox = getViewBox(svg);
  const inner = getInnerSvg(svg);
  const name = toComponentName(displayName);
  return `export const ${name} = ({ size = 24, color = "#000000" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="${viewBox}"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      ${inner}
    </svg>
  );
};`;
}

function generateVue(svg: string): string {
  const viewBox = getViewBox(svg);
  const inner = getInnerSvg(svg);
  return `<script setup>
defineProps({ size: { type: Number, default: 24 }, color: { type: String, default: "#000000" } });
</script>

<template>
  <svg :width="size" :height="size" viewBox="\`${viewBox}\`" :fill="color" xmlns="http://www.w3.org/2000/svg">
    ${inner}
  </svg>
</template>`;
}

function generateSvelte(svg: string): string {
  const viewBox = getViewBox(svg);
  const inner = getInnerSvg(svg);
  return `<script>
  export let size = 24;
  export let color = "#000000";
</script>

<svg width="{size}" height="{size}" viewBox="${viewBox}" fill={color} xmlns="http://www.w3.org/2000/svg">
  ${inner}
</svg>`;
}

function generateHtml(iconPath: string, displayName: string): string {
  return `<img src="${iconPath}" alt="${displayName}" width="24" height="24" />`;
}

function generateWebComponent(svg: string, displayName: string): string {
  const viewBox = getViewBox(svg);
  const inner = getInnerSvg(svg).replace(/`/g, "\\`");
  const tagName = `icon-${displayName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;
  const className = toComponentName(displayName) + "Icon";

  return `class ${className} extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.size = this.getAttribute("size") || "24";
    this.color = this.getAttribute("color") || "#000000";
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = \`
      <svg
        width="\${this.size}"
        height="\${this.size}"
        viewBox="${viewBox}"
        fill="\${this.color}"
        xmlns="http://www.w3.org/2000/svg"
      >
        ${inner}
      </svg>
    \`;
  }
}

customElements.define("${tagName}", ${className});`;
}

function Icons({
  icon: Icon,
  ...props
}: React.ComponentPropsWithoutRef<"span"> & {
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <span {...props}>
      <Icon />
    </span>
  );
}

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
  const [selectedFramework, setSelectedFramework] = useState<Framework>("svg");

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

  const activeIconPath = getVariantPath(selectedMode, selectedStyle);
  const displayName = icon ? getDisplayName(icon.name) : "";

  const frameworkCode = useMemo(() => {
    if (!activeSvg) return "";
    switch (selectedFramework) {
      case "svg":
        return activeSvg;
      case "react":
        return generateReact(activeSvg, displayName);
      case "vue":
        return generateVue(activeSvg);
      case "svelte":
        return generateSvelte(activeSvg);
      case "html":
        return generateHtml(activeIconPath, displayName);
      case "webcomponent":
        return generateWebComponent(activeSvg, displayName);
    }
  }, [activeSvg, selectedFramework, displayName, activeIconPath]);

  const handleCopy = () => {
    navigator.clipboard.writeText(frameworkCode);
    onCopy();
  };

  const handleDownload = () => {
    if (!frameworkCode) return;
    const fw = FRAMEWORKS.find((f) => f.id === selectedFramework)!;
    const blob = new Blob([frameworkCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${displayName}-${selectedMode}-${selectedStyle}.${fw.ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
        className={`prev-modal flex items-start justify-center bg-zinc-900 p-8 border border-zinc-700 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl transition-all duration-200 ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ----- Left sidebar ----- */}
        <div className="flex flex-col items-center gap-6 pr-5 w-[10%]">
          {/* Mode picker */}
          <div className="flex flex-col gap-y-2">
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

          {/* Style picker with mini previews */}
          <div className="flex flex-col gap-y-4">
            {STYLES.map((style) => {
              const variantPath = getVariantPath(selectedMode, style);
              return (
                <button
                  key={style}
                  onClick={() => setSelectedStyle(style)}
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

        {/* ----- Right main content ----- */}
        <div className="w-[90%] flex flex-col items-start gap-y-5 pl-5 *:w-full">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 z-10 rounded-t-3xl">
            <h3 className="text-lg font-semibold text-zinc-100">
              {displayName}
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

          {/* ----- Framework tabs ----- */}
          <div className="flex flex-wrap gap-2">
            {FRAMEWORKS.map((fw) => (
              <button
                key={fw.id}
                onClick={() => setSelectedFramework(fw.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                  selectedFramework === fw.id
                    ? "bg-teal-500/20 text-teal-300 ring-1 ring-teal-500/50"
                    : "bg-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700"
                }`}
              >
                {fw.label}
              </button>
            ))}
          </div>

          {/* Large preview */}
          <div className="p-4 flex justify-center items-center bg-zinc-950/50 rounded-xl border border-zinc-800 relative">
            <Icons
              className="svg-bg size-53.5"
              aria-label="svgbg"
              icon={svgbgIcon}
            />
            {loadingVariant ? (
              <div className="absolute lg:w-38 w-30 aspect-square flex items-center justify-center">
                <div className="size-6 rounded-full border-2 border-zinc-600 border-t-teal-400 animate-spin" />
              </div>
            ) : activeSvg ? (
              <img
                src={activeIconPath ? activeIconPath : undefined}
                alt={icon.name}
                className="lg:w-38 w-30 absolute"
              />
            ) : (
              <div className="lg:w-38 w-30 aspect-square flex items-center justify-center text-zinc-600 text-xs absolute">
                Not available
              </div>
            )}
          </div>

          {/* Code block */}
          <pre className="icon-svg-code h-52 bg-zinc-950 rounded-xl p-4 text-xs text-blue-300 overflow-auto max-h-52 font-jet border border-zinc-800">
            {loadingVariant ? (
              <div className="flex items-center justify-center py-4">
                <div className="size-6 rounded-full border-2 border-zinc-600 border-t-teal-400 animate-spin" />
              </div>
            ) : frameworkCode ? (
              frameworkCode
            ) : (
              <>Not available for this combination</>
            )}
          </pre>

          {/* Actions */}
          <div className="flex gap-3 justify-end border-t pt-6 border-zinc-800 bg-zinc-900 rounded-b-3xl">
            {/* Copy */}
            <button
              onClick={handleCopy}
              disabled={!frameworkCode}
              className="cursor-pointer px-3 py-2.5 bg-zinc-800 text-zinc-200 rounded-xl text-sm font-medium hover:bg-zinc-700 transition-all duration-200 flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              title="Copy code"
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

            {/* Download */}
            <button
              onClick={handleDownload}
              disabled={!frameworkCode}
              className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                frameworkCode
                  ? "bg-zinc-100 text-zinc-900 hover:bg-white"
                  : "bg-zinc-700 text-zinc-500"
              }`}
              title="Download file"
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
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
