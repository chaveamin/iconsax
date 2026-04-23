import { forwardRef } from "react";
import { IconMeta } from "../types";
import { IconCard } from "./IconCard";

interface IconGridProps {
  icons: IconMeta[];
  selectedIcons: Set<string>;
  onIconClick: (path: string, index: number, shiftKey: boolean) => void;
  onToggleSelection: (path: string) => void;
  onPreview: (icon: IconMeta) => void;
}

export const IconGrid = forwardRef<HTMLDivElement, IconGridProps>(
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
          <IconCard
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

IconGrid.displayName = "IconGrid";
