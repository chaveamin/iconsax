import { forwardRef } from "react";
import { AnimatedIconMeta } from "../types";
import { AnimatedIconCard } from "./AnimatedIconCard";

interface AnimatedIconGridProps {
  icons: AnimatedIconMeta[];
  selectedIcons: Set<string>;
  onIconClick: (path: string, index: number, shiftKey: boolean) => void;
  onToggleSelection: (path: string) => void;
  onPreview: (icon: AnimatedIconMeta) => void;
}

export const AnimatedIconGrid = forwardRef<HTMLDivElement, AnimatedIconGridProps>(
  (
    { icons, selectedIcons, onIconClick, onToggleSelection, onPreview },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className="grid grid-cols-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 select-none"
      >
        {icons.map((icon, index) => (
          <AnimatedIconCard
            key={icon.path}
            icon={icon}
            isSelected={selectedIcons.has(icon.path)}
            onToggle={() => onToggleSelection(icon.path)}
            onClick={(e) => onIconClick(icon.path, index, e.shiftKey)}
            onPreview={() => onPreview(icon)}
          />
        ))}
      </div>
    );
  },
);

AnimatedIconGrid.displayName = "AnimatedIconGrid";
