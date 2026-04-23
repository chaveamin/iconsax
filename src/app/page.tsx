"use client";

import { useState, useMemo } from "react";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { IconMeta } from "@/src/types";
import { useIcons } from "@/src/hooks/useIcons";
import { useSelection } from "@/src/hooks/useSelection";
import { useToast } from "@/src/hooks/useToast";
import { Header } from "@/src/components/Header";
import { FilterBar } from "@/src/components/FilterBar";
import { SelectionActions } from "@/src/components/SelectionActions";
import { IconGrid } from "@/src/components/IconGrid";
import { PreviewModal } from "@/src/components/PreviewModal";
import { Toast } from "@/src/components/Toast";
import { SelectOption } from "@/src/types";

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
  const { icons, loading, categories } = useIcons();
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
  const [svgContent, setSvgContent] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter icons
  const filteredIcons = useMemo(() => {
    return icons.filter((icon) => {
      if (selectedMode !== "all" && icon.mode !== selectedMode) return false;
      if (selectedCategory !== "all" && icon.category !== selectedCategory)
        return false;
      if (selectedStyle !== "all" && icon.style !== selectedStyle) return false;
      if (searchTerm.trim()) {
        return icon.name.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return true;
    });
  }, [icons, selectedMode, selectedCategory, selectedStyle, searchTerm]);

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
  }, [selectedMode, selectedCategory, selectedStyle, searchTerm]);

  const loadMore = () => {
    setDisplayCount((prev) => Math.min(prev + 50, filteredIcons.length));
  };

  const handleSelectAll = () => selectAll(filteredIcons);
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

  const closePreview = () => {
    setIsModalOpen(false);
    setTimeout(() => setPreviewIcon(null), 200);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(svgContent);
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

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-zinc-700">
      <div className="container mx-auto px-4 py-10">
        <Header />
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
            <IconGrid
              ref={gridRef}
              icons={displayedIcons}
              selectedIcons={selectedIcons}
              onIconClick={handleIconClick}
              onToggleSelection={toggleSelection}
              onPreview={openPreview}
            />
            {displayCount < filteredIcons.length && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={loadMore}
                  className="px-8 py-3 bg-zinc-800 text-zinc-200 rounded-2xl text-sm font-medium hover:bg-zinc-700 transition-all duration-200 border border-zinc-700 cursor-pointer"
                >
                  Load More ({filteredIcons.length - displayCount} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <PreviewModal
        icon={previewIcon}
        isOpen={isModalOpen}
        svgContent={svgContent}
        onClose={closePreview}
        onCopy={handleCopyCode}
      />

      <Toast visible={toastVisible} message={toastMessage} />
    </main>
  );
}
