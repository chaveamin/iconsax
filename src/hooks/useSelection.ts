import { useState, useCallback, useRef, useEffect } from "react";
import { IconMeta } from "../types";

export function useSelection(displayedIcons: IconMeta[]) {
  const [selectedIcons, setSelectedIcons] = useState<Set<string>>(new Set());
  const [lastClickedIndex, setLastClickedIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const toggleSelection = useCallback((iconPath: string) => {
    setSelectedIcons((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(iconPath)) newSet.delete(iconPath);
      else newSet.add(iconPath);
      return newSet;
    });
  }, []);

  const selectRange = useCallback(
    (startIdx: number, endIdx: number) => {
      const start = Math.min(startIdx, endIdx);
      const end = Math.max(startIdx, endIdx);
      const iconsInRange = displayedIcons
        .slice(start, end + 1)
        .map((i) => i.path);
      setSelectedIcons((prev) => {
        const newSet = new Set(prev);
        iconsInRange.forEach((path) => newSet.add(path));
        return newSet;
      });
    },
    [displayedIcons],
  );

  const handleIconClick = useCallback(
    (iconPath: string, index: number, shiftKey: boolean) => {
      if (shiftKey && lastClickedIndex !== null) {
        selectRange(lastClickedIndex, index);
      } else {
        toggleSelection(iconPath);
      }
      setLastClickedIndex(index);
    },
    [lastClickedIndex, selectRange, toggleSelection],
  );

  const selectAll = useCallback((icons: IconMeta[]) => {
    setSelectedIcons(new Set(icons.map((i) => i.path)));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIcons(new Set());
    setLastClickedIndex(null);
  }, []);

  // Drag selection
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    let dragActive = false;

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-icon-card]")) return;
      dragActive = true;
      setIsDragging(true);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragActive) return;
      const card = (e.target as HTMLElement).closest("[data-icon-card]");
      if (!card) return;
      const iconPath = card.getAttribute("data-path");
      if (iconPath) {
        setSelectedIcons((prev) => new Set(prev).add(iconPath));
      }
    };

    const handleMouseUp = () => {
      dragActive = false;
      setIsDragging(false);
    };

    grid.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      grid.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [displayedIcons]);

  return {
    selectedIcons,
    isDragging,
    gridRef,
    toggleSelection,
    handleIconClick,
    selectAll,
    clearSelection,
    setSelectedIcons,
  };
}
