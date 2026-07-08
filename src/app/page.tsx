"use client";

import { useState, useMemo, useEffect } from "react";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { IconMeta, AnimatedIconMeta } from "@/src/types";
import { useIcons } from "@/src/hooks/useIcons";
import { useSelection } from "@/src/hooks/useSelection";
import { useToast } from "@/src/hooks/useToast";
import { Header } from "@/src/components/Header";
import { FilterBar } from "@/src/components/FilterBar";
import { SelectionActions } from "@/src/components/SelectionActions";
import { IconGrid } from "@/src/components/IconGrid";
import { AnimatedIconGrid } from "@/src/components/AnimatedIconGrid";
import { PreviewModal } from "@/src/components/PreviewModal";
import { AnimatedPreviewModal } from "@/src/components/AnimatedPreviewModal";
import { Toast } from "@/src/components/Toast";
import { SelectOption } from "@/src/types";
import { getSearchTerms } from "../lib/searchIndex";

const STYLES = [
  "all",
  "bold",
  "broken",
  "bulk",
  "linear",
  "outline",
  "twotone",
];
const MODE_OPTIONS: SelectOption[] = [
  { value: "all", label: "All Modes" },
  { value: "straight", label: "Straight" },
  { value: "rounded", label: "Rounded" },
];

export default function Home() {
  const { icons, animatedIcons, loading, categories, iconType, setIconType } =
    useIcons();
  const {
    visible: toastVisible,
    message: toastMessage,
    showToast,
  } = useToast();

  // Filter states
  const [selectedMode, setSelectedMode] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStyle, setSelectedStyle] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [displayCount, setDisplayCount] = useState(50);

  // Preview state
  const [previewIcon, setPreviewIcon] = useState<IconMeta | null>(null);
  const [previewAnimatedIcon, setPreviewAnimatedIcon] =
    useState<AnimatedIconMeta | null>(null);
  const [svgContent, setSvgContent] = useState("");
  const [jsonContent, setJsonContent] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAnimatedModalOpen, setIsAnimatedModalOpen] = useState(false);

  // Filter icons
  const filteredStaticIcons = useMemo(() => {
    return icons.filter((icon) => {
      if (selectedMode !== "all" && icon.mode !== selectedMode) return false;
      if (selectedCategory !== "all" && icon.category !== selectedCategory)
        return false;
      if (selectedStyle !== "all" && icon.style !== selectedStyle) return false;
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const terms = getSearchTerms(icon.name);
        return (
          terms.some((t) => t.includes(term)) ||
          icon.name.toLowerCase().includes(term)
        );
      }
      return true;
    });
  }, [icons, selectedMode, selectedCategory, selectedStyle, searchTerm]);

  const filteredAnimatedIcons = useMemo(() => {
    return animatedIcons.filter((icon) => {
      if (selectedCategory !== "all" && icon.category !== selectedCategory)
        return false;
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const terms = getSearchTerms(icon.name);
        return (
          terms.some((t) => t.includes(term)) ||
          icon.name.toLowerCase().includes(term)
        );
      }
      return true;
    });
  }, [animatedIcons, selectedCategory, searchTerm]);

  const filteredIcons =
    iconType === "static" ? filteredStaticIcons : filteredAnimatedIcons;

  const displayedIcons = useMemo(() => {
    return filteredIcons.slice(0, displayCount);
  }, [filteredIcons, displayCount]);

  // Selection hook
  const {
    selectedIcons,
    gridRef,
    toggleSelection,
    handleIconClick,
    selectAll,
    clearSelection,
  } = useSelection(displayedIcons);

  // Reset display
  useMemo(() => {
    setDisplayCount(50);
  }, [selectedMode, selectedCategory, selectedStyle, searchTerm, iconType]);

  const loadMore = () => {
    setDisplayCount((prev) => Math.min(prev + 50, filteredIcons.length));
  };

  const handleSelectAll = () => selectAll(displayedIcons);
  const handleClearSelection = () => clearSelection();

  const handleDownload = async () => {
    const zip = new JSZip();
    const fetchPromises = Array.from(selectedIcons).map(async (iconPath) => {
      const res = await fetch(iconPath);
      const svgText = await res.text();
      const fileName = iconPath.split("/").pop()!;
      zip.file(fileName, svgText);
    });
    await Promise.all(fetchPromises);
    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, "selected-icons.zip");
  };

  const openPreview = async (icon: IconMeta) => {
    setPreviewIcon(icon);
    setIsModalOpen(true);
    const res = await fetch(icon.path);
    const text = await res.text();
    setSvgContent(text);
  };

  const openAnimatedPreview = async (icon: AnimatedIconMeta) => {
    setPreviewAnimatedIcon(icon);
    setIsAnimatedModalOpen(true);
  };

  const closePreview = () => {
    setIsModalOpen(false);
    setTimeout(() => setPreviewIcon(null), 200);
  };

  const closeAnimatedPreview = () => {
    setIsAnimatedModalOpen(false);
    setTimeout(() => setPreviewAnimatedIcon(null), 200);
  };

  const handleCopyCode = () => {
    showToast("Copied to clipboard");
  };

  const hasActiveFilters =
    selectedMode !== "all" ||
    selectedCategory !== "all" ||
    selectedStyle !== "all" ||
    searchTerm.trim() !== "";

  const clearAllFilters = () => {
    setSelectedMode("all");
    setSelectedCategory("all");
    setSelectedStyle("all");
    setSearchTerm("");
  };

  const categoryOptions = useMemo(() => {
    return categories.map((cat) => ({
      value: cat,
      label: cat === "all" ? "All Categories" : cat,
    }));
  }, [categories]);

  const styleOptions = STYLES.map((st) => ({
    value: st,
    label: st === "all" ? "All Styles" : st,
  }));

  const totalIcons =
    iconType === "static" ? icons.length : animatedIcons.length;

  return (
    <main className="min-h-screen bg-zinc-900 text-zinc-100 selection:bg-zinc-700">
      <div className="container mx-auto px-4 py-10">
        <Header count={totalIcons} />
        <FilterBar
          modeOptions={MODE_OPTIONS}
          categoryOptions={categoryOptions}
          styleOptions={styleOptions}
          selectedMode={selectedMode}
          selectedCategory={selectedCategory}
          selectedStyle={selectedStyle}
          onModeChange={setSelectedMode}
          onCategoryChange={setSelectedCategory}
          onStyleChange={setSelectedStyle}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearAllFilters}
          iconType={iconType}
          onIconTypeChange={setIconType}
        />
        <SelectionActions
          selectedCount={selectedIcons.size}
          onSelectAll={handleSelectAll}
          onClear={handleClearSelection}
          onDownload={handleDownload}
        />

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="bg-zinc-800/80 rounded-2xl p-4 aspect-square animate-pulse"
              />
            ))}
          </div>
        ) : (
          <>
            {iconType === "static" ? (
              <IconGrid
                ref={gridRef}
                icons={displayedIcons as IconMeta[]}
                selectedIcons={selectedIcons}
                onIconClick={handleIconClick}
                onToggleSelection={toggleSelection}
                onPreview={openPreview}
              />
            ) : (
              <AnimatedIconGrid
                ref={gridRef}
                icons={displayedIcons as AnimatedIconMeta[]}
                selectedIcons={selectedIcons}
                onIconClick={handleIconClick}
                onToggleSelection={toggleSelection}
                onPreview={openAnimatedPreview}
              />
            )}
            {/* {displayCount < filteredIcons.length && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={loadMore}
                  className="px-8 py-3 bg-zinc-800 text-zinc-200 rounded-2xl text-sm font-medium hover:bg-zinc-700 transition-all duration-200 cursor-pointer"
                >
                  Load More
                </button>
              </div>
            )} */}
          </>
        )}
      </div>

      {/* Static icon preview modal */}
      <PreviewModal
        icon={previewIcon}
        isOpen={isModalOpen}
        svgContent={svgContent}
        onClose={closePreview}
        onCopy={handleCopyCode}
        allIcons={icons}
        navIcons={filteredStaticIcons}
      />

      {/* Animated icon preview modal */}
      <AnimatedPreviewModal
        icon={previewAnimatedIcon}
        isOpen={isAnimatedModalOpen}
        jsonContent={jsonContent}
        onClose={closeAnimatedPreview}
        onCopy={handleCopyCode}
        navIcons={filteredAnimatedIcons}
      />

      <Toast visible={toastVisible} message={toastMessage} />
    </main>
  );
}
