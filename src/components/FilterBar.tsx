import { CustomSelect } from "./ui/CustomSelect";
import { SelectOption } from "../types";
import { Icon, crossIcon, searchIcon } from "./ui/Icons";
import { IconType } from "../hooks/useIcons";

const ICON_TYPE_OPTIONS: SelectOption[] = [
  { value: "static", label: "Static" },
  { value: "animated", label: "Animated" },
];

interface FilterBarProps {
  modeOptions: SelectOption[];
  categoryOptions: SelectOption[];
  styleOptions: SelectOption[];
  selectedMode: string;
  selectedCategory: string;
  selectedStyle: string;
  onModeChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onStyleChange: (value: string) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  iconType: IconType;
  onIconTypeChange: (value: IconType) => void;
}

export function FilterBar({
  modeOptions,
  categoryOptions,
  styleOptions,
  selectedMode,
  selectedCategory,
  selectedStyle,
  onModeChange,
  onCategoryChange,
  onStyleChange,
  searchTerm,
  onSearchChange,
  hasActiveFilters,
  onClearFilters,
  iconType,
  onIconTypeChange,
}: FilterBarProps) {
  return (
    <>
      <div className="flex flex-wrap gap-3 mb-8 justify-center lg:*:w-fit *:w-full">
        <CustomSelect
          options={ICON_TYPE_OPTIONS}
          value={iconType}
          onChange={(v) => onIconTypeChange(v as IconType)}
        />
        {iconType === "static" && (
          <>
            <CustomSelect
              options={modeOptions}
              value={selectedMode}
              onChange={onModeChange}
            />
            <CustomSelect
              options={styleOptions}
              value={selectedStyle}
              onChange={onStyleChange}
            />
          </>
        )}
        <CustomSelect
          options={categoryOptions}
          value={selectedCategory}
          onChange={onCategoryChange}
        />

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="px-4 py-2.5 bg-zinc-800 text-zinc-300 rounded-xl text-sm font-medium hover:bg-zinc-700 transition-all duration-200 flex items-center gap-2 border border-zinc-700 cursor-pointer"
          >
            <Icon icon={crossIcon} />
            Clear Filters
          </button>
        )}
      </div>

      <div className="relative mb-8">
        <input
          type="text"
          placeholder="Search icons..."
          className="bg-zinc-700/15 ring ring-zinc-700 rounded-xl pl-10 pr-4 py-2.5 w-full text-sm text-zinc-200 placeholder:text-zinc-500 focus:ring-4 focus:ring-teal-400/10 focus:outline focus:outline-teal-400"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <Icon icon={searchIcon} />
      </div>
    </>
  );
}
