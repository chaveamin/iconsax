import { CustomSelect } from "./ui/CustomSelect";
import { SelectOption } from "../types";

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
}: FilterBarProps) {
  return (
    <>
      <div className="flex flex-wrap gap-3 mb-8 justify-center lg:*:w-fit *:w-full">
        <CustomSelect
          options={modeOptions}
          value={selectedMode}
          onChange={onModeChange}
        />
        <CustomSelect
          options={categoryOptions}
          value={selectedCategory}
          onChange={onCategoryChange}
        />
        <CustomSelect
          options={styleOptions}
          value={selectedStyle}
          onChange={onStyleChange}
        />

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="px-4 py-2.5 bg-zinc-800 text-zinc-300 rounded-xl text-sm font-medium hover:bg-zinc-700 transition-all duration-200 flex items-center gap-2 border border-zinc-700 cursor-pointer"
          >
            <svg
              className="size-4"
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
            Clear Filters
          </button>
        )}
      </div>

      <div className="relative mb-8">
        <input
          type="text"
          placeholder="Search icons..."
          className="bg-zinc-900 border border-zinc-700 rounded-xl pl-10 pr-4 py-2.5 w-full text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 transition-all"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <svg
          className="absolute left-3 top-3 size-4 text-zinc-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </>
  );
}
