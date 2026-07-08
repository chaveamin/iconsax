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
import { FRAMEWORKS, Mode, Style, Framework } from "./types";
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
  navIcons: IconMeta[];
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

interface NavButtonProps {
  direction: "prev" | "next";
  icon: IconMeta | null;
  allIcons: IconMeta[];
  disabled: boolean;
  isOpen: boolean;
  onClick: () => void;
}

function NavButton({
  direction,
  icon,
  allIcons,
  disabled,
  isOpen,
  onClick,
}: NavButtonProps) {
  // Show the icon in its first available variant
  const previewPath = useMemo(() => {
    if (!icon) return "";
    for (const style of [
      "bold",
      "linear",
      "outline",
      "broken",
      "bulk",
      "twotone",
    ]) {
      for (const mode of ["straight", "rounded"]) {
        const p = getVariantPath(icon, allIcons, mode, style);
        if (p) return p;
      }
    }
    return "";
  }, [icon, allIcons]);

  const displayName = icon ? getDisplayName(icon.name) : "";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`group absolute top-1/2 -translate-y-1/2 hidden sm:flex flex-col items-center gap-2 transition-all duration-200 cursor-pointer ${
        direction === "prev" ? "-left-20 lg:-left-58" : "-right-20 lg:-right-58"
      } ${disabled || !isOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}
    >
      <div
        className={`flex ${direction === "next" ? "flex-row-reverse" : ""} items-center gap-1.5 p-3 rounded-2xl border border-zinc-700 bg-zinc-900/80 backdrop-blur-sm hover:border-zinc-500 hover:bg-zinc-800 transition-all duration-150 w-fit`}
      >
        {/* arrow */}
        <svg
          className="size-5 text-zinc-500 group-hover:text-zinc-300 transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d={direction === "prev" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
          />
        </svg>

        {/* mini icon preview */}
        {previewPath ? (
          <img
            src={previewPath}
            alt={displayName}
            className="size-10 lg:size-12 object-contain opacity-60 group-hover:opacity-100 transition-opacity"
          />
        ) : (
          <div className="size-7" />
        )}
      </div>
    </button>
  );
}

export function PreviewModal({
  icon,
  isOpen,
  svgContent,
  onClose,
  onCopy,
  allIcons,
  navIcons,
}: PreviewModalProps) {
  const [activeIcon, setActiveIcon] = useState<IconMeta | null>(icon);
  const [selectedMode, setSelectedMode] = useState<Mode>("straight");
  const [selectedStyle, setSelectedStyle] = useState<Style>("bold");
  const [activeSvg, setActiveSvg] = useState(svgContent);
  const [loadingVariant, setLoadingVariant] = useState(false);
  const [selectedFramework, setSelectedFramework] = useState<Framework>("svg");

  useEffect(() => {
    if (icon) {
      setActiveIcon(icon);
      setSelectedMode(icon.mode as Mode);
      setSelectedStyle(icon.style as Style);
    }
  }, [icon]);

  const navIndex = useMemo(
    () =>
      activeIcon ? navIcons.findIndex((i) => i.path === activeIcon.path) : -1,
    [activeIcon, navIcons],
  );

  const prevIcon = navIndex > 0 ? navIcons[navIndex - 1] : null;
  const nextIcon =
    navIndex < navIcons.length - 1 ? navIcons[navIndex + 1] : null;

  const goTo = (target: IconMeta) => {
    setActiveIcon(target);
    setSelectedMode(target.mode as Mode);
    setSelectedStyle(target.style as Style);
  };

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && prevIcon) goTo(prevIcon);
      if (e.key === "ArrowRight" && nextIcon) goTo(nextIcon);
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, prevIcon, nextIcon]);

  useEffect(() => {
    if (!activeIcon) return;
    const path = getVariantPath(
      activeIcon,
      allIcons,
      selectedMode,
      selectedStyle,
    );
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
  }, [activeIcon, selectedMode, selectedStyle, allIcons]);

  useEffect(() => {
    if (svgContent) setActiveSvg(svgContent);
  }, [svgContent]);

  const activeIconPath = activeIcon
    ? getVariantPath(activeIcon, allIcons, selectedMode, selectedStyle)
    : "";
  const displayName = activeIcon ? getDisplayName(activeIcon.name) : "";

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
  }, [activeSvg, selectedFramework, displayName]);

  const handleCopy = () => {
    navigator.clipboard.writeText(frameworkCode);
    onCopy();
  };

  const handleDownload = () => {
    if (!frameworkCode || !activeIcon) return;
    const fw = FRAMEWORKS.find((f) => f.id === selectedFramework)!;
    const blob = new Blob([frameworkCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${displayName}-${selectedMode}-${selectedStyle}.${fw.ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!activeIcon) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-all duration-200 ${
        isOpen
          ? "bg-black/70 backdrop-blur-sm"
          : "bg-transparent pointer-events-none"
      }`}
      onClick={onClose}
    >
      {/* Wrapper gives NavButtons their absolute positioning anchor */}
      <div
        className="relative w-full max-w-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <NavButton
          direction="prev"
          icon={prevIcon}
          allIcons={allIcons}
          disabled={!prevIcon}
          isOpen={isOpen}
          onClick={() => prevIcon && goTo(prevIcon)}
        />

        <NavButton
          direction="next"
          icon={nextIcon}
          allIcons={allIcons}
          disabled={!nextIcon}
          isOpen={isOpen}
          onClick={() => nextIcon && goTo(nextIcon)}
        />

        {/* Modal box */}
        <div
          className={`prev-modal scrollbar-none flex flex-col sm:flex-row items-start justify-center bg-zinc-900 p-5 sm:py-8 sm:px-12 border border-zinc-700 rounded-3xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-scroll shadow-2xl transition-all duration-200 ${
            isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          {/* Mobile nav arrows */}
          {/* <div className="flex sm:hidden items-center justify-between w-full mb-4">
            <button
              onClick={() => prevIcon && goTo(prevIcon)}
              disabled={!prevIcon}
              className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer disabled:opacity-30"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <span className="text-xs text-zinc-500">
              {navIndex + 1} / {navIcons.length}
            </span>
            <button
              onClick={() => nextIcon && goTo(nextIcon)}
              disabled={!nextIcon}
              className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer disabled:opacity-30"
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div> */}

          <button
            onClick={onClose}
            className="py-10 translate-y-5 sm:hidden block rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
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

          <VariantSidebar
            icon={activeIcon}
            selectedMode={selectedMode}
            selectedStyle={selectedStyle}
            allIcons={allIcons}
            onModeChange={setSelectedMode}
            onStyleChange={setSelectedStyle}
            prevIcon={prevIcon}
            nextIcon={nextIcon}
            navIndex={navIndex}
            navCount={navIcons.length}
            onNavigate={goTo}
          />

          <div className="w-full sm:w-[90%] flex flex-col items-start gap-y-4 sm:gap-y-5 sm:pl-5 *:w-full">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5 w-full">
              <div className="flex sm:flex-col sm:items-start items-center justify-between w-full">
                <h3 className="text-base sm:text-lg font-semibold text-zinc-100">
                  {displayName}
                </h3>
                <span className="text-xs text-zinc-500">
                  {selectedMode} &bull; {activeIcon.category} &bull;{" "}
                  {selectedStyle}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hidden sm:block rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
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
              icon={activeIcon}
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
    </div>
  );
}
