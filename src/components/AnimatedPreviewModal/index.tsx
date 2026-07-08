"use client";

import { AnimatedIconMeta } from "../../types";
import { getDisplayName } from "../../lib/utils";
import { useState, useEffect, useMemo } from "react";
import { AnimatedIcon } from "../AnimatedIcon";
import { AnimatedCodeBlock } from "./AnimatedCodeBlock";
import { AnimatedModalActions } from "./AnimatedModalActions";

interface AnimatedPreviewModalProps {
  icon: AnimatedIconMeta | null;
  isOpen: boolean;
  jsonContent: string;
  onClose: () => void;
  onCopy: () => void;
  navIcons: AnimatedIconMeta[];
}

export function AnimatedPreviewModal({
  icon,
  isOpen,
  jsonContent,
  onClose,
  onCopy,
  navIcons,
}: AnimatedPreviewModalProps) {
  const [activeIcon, setActiveIcon] = useState<AnimatedIconMeta | null>(icon);
  const [activeJson, setActiveJson] = useState(jsonContent);

  useEffect(() => {
    if (icon) {
      setActiveIcon(icon);
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

  const goTo = (target: AnimatedIconMeta) => {
    setActiveIcon(target);
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
    fetch(activeIcon.path)
      .then((res) => (res.ok ? res.text() : Promise.reject()))
      .then(setActiveJson)
      .catch(() => setActiveJson(""));
  }, [activeIcon]);

  useEffect(() => {
    if (jsonContent) setActiveJson(jsonContent);
  }, [jsonContent]);

  const displayName = activeIcon ? getDisplayName(activeIcon.name) : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(activeJson);
    onCopy();
  };

  const handleDownload = () => {
    if (!activeJson || !activeIcon) return;
    const blob = new Blob([activeJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${displayName}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!activeIcon) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center p-4 sm:p-6 transition-all duration-200 ${
        isOpen
          ? "bg-black/70 backdrop-blur-sm"
          : "bg-transparent pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] scrollbar-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Navigation arrows */}
        <button
          onClick={() => prevIcon && goTo(prevIcon)}
          disabled={!prevIcon}
          className={`hidden sm:flex absolute top-1/2 -translate-y-1/2 -left-16 items-center justify-center p-3 rounded-2xl border border-zinc-700 bg-zinc-900/80 backdrop-blur-sm hover:border-zinc-500 hover:bg-zinc-800 transition-all duration-150 cursor-pointer ${
            !prevIcon || !isOpen
              ? "opacity-0 pointer-events-none"
              : "opacity-100"
          }`}
        >
          <svg
            className="size-5 text-zinc-500 hover:text-zinc-300 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          onClick={() => nextIcon && goTo(nextIcon)}
          disabled={!nextIcon}
          className={`hidden sm:flex absolute top-1/2 -translate-y-1/2 -right-16 items-center justify-center p-3 rounded-2xl border border-zinc-700 bg-zinc-900/80 backdrop-blur-sm hover:border-zinc-500 hover:bg-zinc-800 transition-all duration-150 cursor-pointer ${
            !nextIcon || !isOpen
              ? "opacity-0 pointer-events-none"
              : "opacity-100"
          }`}
        >
          <svg
            className="size-5 text-zinc-500 hover:text-zinc-300 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Modal box */}
        <div
          className={`bg-zinc-900 p-6 sm:p-8 border border-zinc-700 rounded-3xl shadow-2xl transition-all duration-200 ${
            isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-5">
            <div>
              <h3 className="text-lg font-semibold text-zinc-100">
                {displayName}
              </h3>
              <span className="text-xs text-zinc-500">
                animated &bull; {activeIcon.category}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {/* Mobile nav arrows */}
              <button
                onClick={() => prevIcon && goTo(prevIcon)}
                disabled={!prevIcon}
                className={`sm:hidden p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer disabled:opacity-30`}
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
              <button
                onClick={() => nextIcon && goTo(nextIcon)}
                disabled={!nextIcon}
                className={`sm:hidden p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer disabled:opacity-30`}
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
          </div>

          {/* Preview */}
          <div className="p-6 flex justify-center items-center bg-zinc-950/50 rounded-xl border border-zinc-800 mb-5">
            <AnimatedIcon
              className="invert"
              path={activeIcon.path}
              size={120}
            />
          </div>

          {/* Code block */}
          <AnimatedCodeBlock code={activeJson} />

          {/* Actions */}
          <AnimatedModalActions
            disabled={!activeJson}
            onCopy={handleCopy}
            onDownload={handleDownload}
          />
        </div>
      </div>
    </div>
  );
}
