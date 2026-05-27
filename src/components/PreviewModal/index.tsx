import { IconMeta } from "../../types";
import { getDisplayName } from "../../lib/utils";
import { useState, useEffect, useMemo } from "react";
import {
  generateReact,
  generateVue,
  generateSvelte,
  generateHtml,
  generateWebComponent,
} from "../../lib/iconCodeGenerators";
import { MODES, STYLES, FRAMEWORKS, Mode, Style, Framework } from "./types";
import { VariantSidebar } from "./VariantSlider";
import { FrameworkTabs } from "./FrameworkTab";
import { IconPreview } from "./IconPreview";
import { CodeBlock } from "./CodeBlock";
import { ModalActions } from "./ModalActions";

interface PreviewModalProps {
  icon: IconMeta | null;
  isOpen: boolean;
  svgContent: string;
  onClose: () => void;
  onCopy: () => void;
  allIcons: IconMeta[];
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
    const path = getVariantPath(icon, allIcons, selectedMode, selectedStyle);
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

  const activeIconPath = icon
    ? getVariantPath(icon, allIcons, selectedMode, selectedStyle)
    : "";
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
        return generateHtml(activeSvg, displayName);
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
        <VariantSidebar
          icon={icon}
          selectedMode={selectedMode}
          selectedStyle={selectedStyle}
          allIcons={allIcons}
          onModeChange={setSelectedMode}
          onStyleChange={setSelectedStyle}
        />

        <div className="w-[90%] flex flex-col items-start gap-y-5 pl-5 *:w-full">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 z-10 rounded-t-3xl pb-3">
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

          <FrameworkTabs
            selected={selectedFramework}
            onChange={setSelectedFramework}
          />

          <IconPreview
            icon={icon}
            activeIconPath={activeIconPath}
            activeSvg={activeSvg}
            loading={loadingVariant}
          />

          <CodeBlock code={frameworkCode} loading={loadingVariant} />

          <ModalActions
            disabled={!frameworkCode}
            onCopy={handleCopy}
            onDownload={handleDownload}
          />
        </div>
      </div>
    </div>
  );
}
